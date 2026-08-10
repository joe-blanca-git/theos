using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Domain.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.FinancialClosings.Commands
{
    public record ProcessProfessorClosingResult(bool Success, string Message, int? ClosingId);

    public record ProcessProfessorClosingCommand(int TeacherId) : IRequest<ProcessProfessorClosingResult>;

    public class ProcessProfessorClosingCommandHandler : IRequestHandler<ProcessProfessorClosingCommand, ProcessProfessorClosingResult>
    {
        private readonly ITheosDbContext _context;
        private readonly IUserContextService _userContextService;

        public ProcessProfessorClosingCommandHandler(ITheosDbContext context, IUserContextService userContextService)
        {
            _context = context;
            _userContextService = userContextService;
        }

        public async Task<ProcessProfessorClosingResult> Handle(ProcessProfessorClosingCommand request, CancellationToken cancellationToken)
        {
            var currentUser = await _userContextService.GetCurrentUserAsync();
            var adminCheck = await _context.Teachers.FirstOrDefaultAsync(t => t.IdAgivys == currentUser.ExternalId, cancellationToken);

            if (adminCheck == null || adminCheck.Role != "Admin")
                return new ProcessProfessorClosingResult(false, "Apenas administradores podem processar fechamentos.", null);

            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Id == request.TeacherId, cancellationToken);
            if (teacher == null)
                return new ProcessProfessorClosingResult(false, "Professor não encontrado.", null);

            // Get active taxes
            var activeTaxes = await _context.FinancialTaxes
                .Where(t => t.IsActive && t.EffectiveFrom <= DateTime.UtcNow)
                .GroupBy(t => t.Type)
                .Select(g => g.OrderByDescending(t => t.EffectiveFrom).FirstOrDefault())
                .ToListAsync(cancellationToken);

            decimal theosTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.Theos)?.Percentage ?? 0m;
            decimal pixTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.Pix)?.Percentage ?? 0m;
            decimal creditCardTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.CreditCard)?.Percentage ?? 0m;

            var thresholdDate = DateTime.UtcNow.AddDays(-7);

            // Fetch eligible unbilled purchases
            var eligiblePurchases = await _context.Purchases
                .Include(p => p.Course)
                .ThenInclude(c => c.CourseTeachers)
                .Where(p => p.Status == PurchaseStatus.Approved && 
                            p.CreatedAt <= thresholdDate &&
                            !_context.FinancialClosingItems.Any(fci => fci.PurchaseId == p.Id && fci.FinancialClosing.TeacherId == request.TeacherId))
                .Where(p => p.Course.CourseTeachers.Any(ct => ct.TeacherId == request.TeacherId))
                .ToListAsync(cancellationToken);

            if (!eligiblePurchases.Any())
                return new ProcessProfessorClosingResult(false, "Nenhuma venda elegível para faturamento neste momento.", null);

            decimal totalGrossRevenue = 0;
            decimal totalBankFees = 0;
            decimal totalTheosFees = 0;
            decimal totalNetValue = 0;
            decimal totalToReceive = 0;
            
            DateTime minDate = eligiblePurchases.Min(p => p.CreatedAt);
            DateTime maxDate = eligiblePurchases.Max(p => p.CreatedAt);

            var closingItems = new List<FinancialClosingItem>();

            foreach (var purchase in eligiblePurchases)
            {
                var courseTeacher = purchase.Course.CourseTeachers.First(ct => ct.TeacherId == teacher.Id);
                decimal teacherPercentage = courseTeacher.ParticipationPercentage / 100m;

                decimal grossValue = purchase.Amount;
                decimal bankFeeValue = purchase.PaymentMethod == "PIX" ? pixTax : grossValue * (creditCardTax / 100m);
                decimal theosFeeValue = grossValue * (theosTax / 100m);
                decimal netValue = grossValue - bankFeeValue - theosFeeValue;
                decimal calculatedTeacherValue = netValue * teacherPercentage;

                totalGrossRevenue += grossValue * teacherPercentage;
                totalBankFees += bankFeeValue * teacherPercentage;
                totalTheosFees += theosFeeValue * teacherPercentage;
                totalNetValue += netValue * teacherPercentage;
                totalToReceive += calculatedTeacherValue;

                var closingItem = new FinancialClosingItem(
                    purchase.Id,
                    courseTeacher.ParticipationPercentage,
                    grossValue,
                    bankFeeValue,
                    theosFeeValue,
                    calculatedTeacherValue
                );
                
                closingItems.Add(closingItem);
            }

            var financialClosing = new FinancialClosing(
                request.TeacherId,
                minDate,
                maxDate,
                totalGrossRevenue,
                totalBankFees,
                totalTheosFees,
                totalToReceive
            );

            foreach (var item in closingItems)
            {
                financialClosing.AddItem(item);
            }

            _context.FinancialClosings.Add(financialClosing);
            await _context.SaveChangesAsync(cancellationToken);

            return new ProcessProfessorClosingResult(true, "Faturamento processado com sucesso.", financialClosing.Id);
        }
    }
}
