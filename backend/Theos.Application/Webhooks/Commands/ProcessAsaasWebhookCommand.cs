using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Enums;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Theos.Application.Webhooks.Commands;

public class ProcessAsaasWebhookCommand : IRequest<bool>
{
    public string Event { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
}

public class ProcessAsaasWebhookCommandHandler : IRequestHandler<ProcessAsaasWebhookCommand, bool>
{
    private readonly ITheosDbContext _context;
    private readonly IPaymentEventPublisher _paymentEventPublisher;
    private readonly Microsoft.Extensions.Logging.ILogger<ProcessAsaasWebhookCommandHandler> _logger;

    public ProcessAsaasWebhookCommandHandler(
        ITheosDbContext context,
        IPaymentEventPublisher paymentEventPublisher,
        Microsoft.Extensions.Logging.ILogger<ProcessAsaasWebhookCommandHandler> logger)
    {
        _context = context;
        _paymentEventPublisher = paymentEventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(ProcessAsaasWebhookCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Processando webhook para PaymentId: {request.PaymentId}, Event: {request.Event}");

        // 1. Tentar encontrar como Purchase (Avulso)
        var purchase = await _context.Purchases
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.AsaasPaymentId == request.PaymentId, cancellationToken);

        if (purchase != null)
        {
            _logger.LogInformation($"Compra encontrada: Id={purchase.Id}, Status atual={purchase.Status}. Processando evento...");
            return await ProcessPurchaseAsync(purchase, request.Event, cancellationToken);
        }

        _logger.LogWarning($"Compra não encontrada para o PaymentId Asaas: {request.PaymentId}");
        // Pagamento não encontrado em nossa base
        return false;
    }

    private async Task<bool> ProcessPurchaseAsync(Theos.Domain.Entities.Purchase purchase, string eventType, CancellationToken cancellationToken)
    {
        var externalUserId = purchase.User.ExternalId;
        
        if (eventType == "PAYMENT_RECEIVED" || eventType == "PAYMENT_CONFIRMED")
        {
            if (purchase.Status == PurchaseStatus.Approved) 
            {
                _logger.LogInformation($"Compra Id={purchase.Id} já estava aprovada. Ignorando.");
                return true; // Idempotência
            }

            purchase.Approve();
            _logger.LogInformation($"Compra Id={purchase.Id} aprovada com sucesso. Criando matrícula...");

            // Garantir que a matrícula (Enrollment) seja criada
            bool enrollmentExists = await _context.Enrollments.AnyAsync(e => e.UserId == purchase.UserId && e.CourseId == purchase.CourseId, cancellationToken);
            if (!enrollmentExists)
            {
                var enrollment = Theos.Domain.Entities.Enrollment.Create(purchase.UserId, purchase.CourseId, EnrollmentOrigin.Purchase);
                _context.Enrollments.Add(enrollment);
                _logger.LogInformation($"Matrícula criada para o usuário {purchase.UserId} no curso {purchase.CourseId}.");
            }

            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation($"Alterações salvas no banco de dados para a compra Id={purchase.Id}.");

            if (externalUserId != null)
            {
                _logger.LogInformation($"Enviando evento de SignalR para o usuário {externalUserId}...");
                await _paymentEventPublisher.PublishPaymentConfirmedAsync(externalUserId, "AVULSO", purchase.CourseId);
            }
            return true;
        }
        else if (eventType == "PAYMENT_REFUNDED")
        {
            if (purchase.Status == PurchaseStatus.Refunded) return true;

            purchase.Refund();

            // Desativar matrícula
            var enrollment = await _context.Enrollments.FirstOrDefaultAsync(e => e.UserId == purchase.UserId && e.CourseId == purchase.CourseId, cancellationToken);
            if (enrollment != null)
            {
                enrollment.Deactivate();
            }

            await _context.SaveChangesAsync(cancellationToken);

            if (externalUserId != null)
            {
                await _paymentEventPublisher.PublishPaymentRefundedAsync(externalUserId, "AVULSO", purchase.CourseId);
            }
            return true;
        }
        else if (eventType == "PAYMENT_DELETED" || eventType == "PAYMENT_CANCELED")
        {
            if (purchase.Status == PurchaseStatus.Canceled) return true;
            purchase.Cancel();
            await _context.SaveChangesAsync(cancellationToken);
            if (externalUserId != null)
            {
                await _paymentEventPublisher.PublishPaymentCanceledAsync(externalUserId, "AVULSO", purchase.CourseId);
            }
            return true;
        }
        else if (eventType == "PAYMENT_OVERDUE")
        {
            if (purchase.Status == PurchaseStatus.Expired) return true;
            purchase.Expire();
            await _context.SaveChangesAsync(cancellationToken);
            if (externalUserId != null)
            {
                await _paymentEventPublisher.PublishPaymentCanceledAsync(externalUserId, "AVULSO", purchase.CourseId);
            }
            return true;
        }

        return false;
    }
}
