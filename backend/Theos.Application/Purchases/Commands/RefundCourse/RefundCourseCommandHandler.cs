using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.Purchases.Commands.RefundCourse;

public class RefundCourseCommandHandler : IRequestHandler<RefundCourseCommand, RefundCourseResponseDto>
{
    private readonly ITheosDbContext _context;
    private readonly IAsaasService _asaasService;
    private readonly IUserContextService _userContextService;

    public RefundCourseCommandHandler(ITheosDbContext context, IAsaasService asaasService, IUserContextService userContextService)
    {
        _context = context;
        _asaasService = asaasService;
        _userContextService = userContextService;
    }

    public async Task<RefundCourseResponseDto> Handle(RefundCourseCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await _userContextService.GetCurrentUserAsync();
            var purchase = await _context.Purchases
                .FirstOrDefaultAsync(p => p.Id == request.PurchaseId && p.UserId == currentUser.Id, cancellationToken);

            if (purchase == null)
            {
                return new RefundCourseResponseDto
                {
                    Success = false,
                    Message = "Compra não encontrada."
                };
            }

            if (purchase.Status != Domain.Enums.PurchaseStatus.Approved)
            {
                return new RefundCourseResponseDto
                {
                    Success = false,
                    Message = "Compra não está aprovada para estorno."
                };
            }

            var deadline = purchase.CreatedAt.AddDays(7);
            if (DateTime.UtcNow > deadline)
            {
                return new RefundCourseResponseDto
                {
                    Success = false,
                    Message = "Prazo de estorno expirado."
                };
            }

            if (string.IsNullOrWhiteSpace(purchase.AsaasPaymentId))
            {
                return new RefundCourseResponseDto
                {
                    Success = false,
                    Message = "Pagamento Asaas não encontrado para esta compra."
                };
            }

            var courseData = await _context.Courses
                .Where(c => c.Id == purchase.CourseId)
                .Select(c => new {
                    TotalLessons = c.Modules.SelectMany(m => m.Lessons).Count(l => l.Active),
                    CompletedLessons = c.Modules.SelectMany(m => m.Lessons).SelectMany(l => l.LessonViews).Count(lv => lv.UserId == currentUser.Id)
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (courseData != null)
            {
                double progress = courseData.TotalLessons > 0 ? (courseData.CompletedLessons * 100.0) / courseData.TotalLessons : 0;
                if (progress > 20)
                {
                    return new RefundCourseResponseDto
                    {
                        Success = false,
                        Message = "O estorno não pode ser realizado porque o progresso do curso ultrapassou 20%."
                    };
                }
            }

            purchase.MarkAsRefundRequested();

            var requestCode = $"REF-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
            var refundRequest = RefundRequest.Create(purchase.Id, requestCode, "Solicitado pelo aluno no portal", null);

            _context.RefundRequests.Add(refundRequest);
            await _context.SaveChangesAsync(cancellationToken);

            return new RefundCourseResponseDto
            {
                Success = true,
                Message = "Sua solicitação de estorno foi enviada e está em análise."
            };
    }
}
