using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Domain.Enums;

namespace Theos.Application.FinancialTaxes.Commands
{
    public record CreateFinancialTaxResult(bool Success, string Message);

    public record CreateFinancialTaxCommand : IRequest<CreateFinancialTaxResult>
    {
        public TaxType Type { get; init; }
        public decimal Percentage { get; init; }
        public DateTime EffectiveFrom { get; init; }
    }

    public class CreateFinancialTaxCommandHandler : IRequestHandler<CreateFinancialTaxCommand, CreateFinancialTaxResult>
    {
        private readonly ITheosDbContext _context;
        private readonly IUserContextService _userContextService;

        public CreateFinancialTaxCommandHandler(ITheosDbContext context, IUserContextService userContextService)
        {
            _context = context;
            _userContextService = userContextService;
        }

        public async Task<CreateFinancialTaxResult> Handle(CreateFinancialTaxCommand request, CancellationToken cancellationToken)
        {
            var currentUser = await _userContextService.GetCurrentUserAsync();

            var adminCheck = _context.Teachers.FirstOrDefault(t => t.IdAgivys == currentUser.ExternalId);
            if (adminCheck == null || adminCheck.Role != "Admin")
                return new CreateFinancialTaxResult(false, "Apenas administradores podem criar taxas.");

            var tax = new FinancialTax(request.Type, request.Percentage, request.EffectiveFrom);
            
            _context.FinancialTaxes.Add(tax);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateFinancialTaxResult(true, "Taxa financeira criada com sucesso.");
        }
    }
}
