using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Enums;

namespace Theos.Application.Refunds.Commands;

public record ExecuteRefundCommand(int RefundRequestId) : IRequest<bool>;

public class ExecuteRefundCommandHandler : IRequestHandler<ExecuteRefundCommand, bool>
{
    private readonly ITheosDbContext _context;
    private readonly IAsaasService _asaasService;

    public ExecuteRefundCommandHandler(ITheosDbContext context, IAsaasService asaasService)
    {
        _context = context;
        _asaasService = asaasService;
    }

    public async Task<bool> Handle(ExecuteRefundCommand request, CancellationToken cancellationToken)
    {
        var refund = await _context.RefundRequests
            .Include(r => r.Purchase)
            .FirstOrDefaultAsync(r => r.Id == request.RefundRequestId, cancellationToken);

        if (refund == null || refund.Status != RefundStatus.Approved)
            throw new Exception("Solicitação não encontrada ou não está aprovada.");

        if (string.IsNullOrWhiteSpace(refund.Purchase.AsaasPaymentId))
        {
            refund.MarkAsFailed("Pagamento Asaas não encontrado.");
            await _context.SaveChangesAsync(cancellationToken);
            throw new Exception("Pagamento Asaas não encontrado para esta compra.");
        }

        try
        {
            refund.Process();
            await _context.SaveChangesAsync(cancellationToken);

            await _asaasService.RefundPaymentAsync(refund.Purchase.AsaasPaymentId, cancellationToken);

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == refund.Purchase.UserId && e.CourseId == refund.Purchase.CourseId, cancellationToken);

            if (enrollment != null)
            {
                _context.Enrollments.Remove(enrollment);
            }

            refund.Purchase.Refund();
            refund.MarkAsRefunded();

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            refund.MarkAsFailed(ex.Message);
            await _context.SaveChangesAsync(cancellationToken);
            throw new Exception("Falha ao executar reembolso no gateway: " + ex.Message);
        }
    }
}
