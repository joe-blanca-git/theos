using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.FinancialClosings.Queries
{
    public record FinancialClosingItemSimulationDto(
        int PurchaseId,
        string CourseName,
        string StudentName,
        DateTime PurchaseDate,
        string PaymentMethod,
        decimal AppliedTeacherPercentage,
        decimal GrossValue,
        decimal BankFeeValue,
        decimal TheosFeeValue,
        decimal CalculatedValue
    );

    public record FinancialClosingSimulationDto(
        decimal GrossRevenue,
        decimal BankFeesTotal,
        decimal TheosFeesTotal,
        decimal NetValue,
        decimal TotalToReceive,
        List<FinancialClosingItemSimulationDto> Items
    );

    public record SimulateProfessorClosingQuery : IRequest<FinancialClosingSimulationDto>;

    public class SimulateProfessorClosingQueryHandler : IRequestHandler<SimulateProfessorClosingQuery, FinancialClosingSimulationDto>
    {
        private readonly ITheosDbContext _context;
        private readonly IUserContextService _userContextService;

        public SimulateProfessorClosingQueryHandler(ITheosDbContext context, IUserContextService userContextService)
        {
            _context = context;
            _userContextService = userContextService;
        }

        public async Task<FinancialClosingSimulationDto> Handle(SimulateProfessorClosingQuery request, CancellationToken cancellationToken)
        {
            var currentUser = await _userContextService.GetCurrentUserAsync();
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.IdAgivys == currentUser.ExternalId, cancellationToken);

            if (teacher == null)
                return new FinancialClosingSimulationDto(0, 0, 0, 0, 0, new List<FinancialClosingItemSimulationDto>());

            // Get active taxes
            var activeTaxes = await _context.FinancialTaxes
                .Where(t => t.IsActive && t.EffectiveFrom <= DateTime.UtcNow)
                .GroupBy(t => t.Type)
                .Select(g => g.OrderByDescending(t => t.EffectiveFrom).FirstOrDefault())
                .ToListAsync(cancellationToken);

            decimal theosTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.Theos)?.Percentage ?? 0m;
            decimal pixTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.Pix)?.Percentage ?? 0m;
            decimal creditCardTax = activeTaxes.FirstOrDefault(t => t?.Type == TaxType.CreditCard)?.Percentage ?? 0m;

            // Elegibility: 7 days ago
            var thresholdDate = DateTime.UtcNow.AddDays(-7);

            // Fetch eligible unbilled purchases
            var eligiblePurchases = await _context.Purchases
                .Include(p => p.Course)
                .ThenInclude(c => c.CourseTeachers)
                .Include(p => p.User)
                .Where(p => p.Status == PurchaseStatus.Approved && 
                            p.CreatedAt <= thresholdDate &&
                            !_context.FinancialClosingItems.Any(fci => fci.PurchaseId == p.Id && fci.FinancialClosing.TeacherId == teacher.Id))
                .Where(p => p.Course.CourseTeachers.Any(ct => ct.TeacherId == teacher.Id))
                .ToListAsync(cancellationToken);

            var items = new List<FinancialClosingItemSimulationDto>();
            
            decimal totalGrossRevenue = 0;
            decimal totalBankFees = 0;
            decimal totalTheosFees = 0;
            decimal totalNetValue = 0;
            decimal totalToReceive = 0;

            foreach (var purchase in eligiblePurchases)
            {
                var courseTeacher = purchase.Course.CourseTeachers.First(ct => ct.TeacherId == teacher.Id);
                decimal teacherPercentage = courseTeacher.ParticipationPercentage / 100m;

                decimal grossValue = purchase.Amount;
                decimal bankFeeValue = purchase.PaymentMethod == "PIX" ? pixTax : grossValue * (creditCardTax / 100m);
                decimal theosFeeValue = grossValue * (theosTax / 100m);
                decimal netValue = grossValue - bankFeeValue - theosFeeValue;
                decimal calculatedTeacherValue = netValue * teacherPercentage;

                totalGrossRevenue += grossValue * teacherPercentage; // Proportionate gross revenue
                totalBankFees += bankFeeValue * teacherPercentage;
                totalTheosFees += theosFeeValue * teacherPercentage;
                totalNetValue += netValue * teacherPercentage;
                totalToReceive += calculatedTeacherValue;

                items.Add(new FinancialClosingItemSimulationDto(
                    purchase.Id,
                    purchase.Course.Name,
                    purchase.User.FullName ?? "Aluno",
                    purchase.CreatedAt,
                    purchase.PaymentMethod,
                    courseTeacher.ParticipationPercentage,
                    grossValue,
                    bankFeeValue,
                    theosFeeValue,
                    calculatedTeacherValue
                ));
            }

            return new FinancialClosingSimulationDto(
                Math.Round(totalGrossRevenue, 2),
                Math.Round(totalBankFees, 2),
                Math.Round(totalTheosFees, 2),
                Math.Round(totalNetValue, 2),
                Math.Round(totalToReceive, 2),
                items.OrderByDescending(i => i.PurchaseDate).ToList()
            );
        }
    }
}
