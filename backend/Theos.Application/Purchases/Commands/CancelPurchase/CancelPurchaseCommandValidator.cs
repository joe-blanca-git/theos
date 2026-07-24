using FluentValidation;

namespace Theos.Application.Purchases.Commands.CancelPurchase;

public class CancelPurchaseCommandValidator : AbstractValidator<CancelPurchaseCommand>
{
    public CancelPurchaseCommandValidator()
    {
        RuleFor(v => v.PurchaseId)
            .GreaterThan(0).WithMessage("ID da compra inválido.");
    }
}
