using MediatR;

namespace Theos.Application.Purchases.Commands.CancelPurchase;

public record CancelPurchaseCommand(int PurchaseId) : IRequest<CancelPurchaseResponseDto>;
