using Theos.Application.Purchases.Commands;
using Theos.Domain.Entities;

namespace Theos.Application.Common.Interfaces;

public interface IAsaasService
{
    Task<string> CreateCustomerAsync(User user, CancellationToken ct);
    Task UpdateCustomerAsync(User user, CancellationToken ct);
    
    Task<PurchaseResponseDto> CreatePaymentAsync(Purchase purchase, CreditCardInfo? card, CancellationToken ct);

    Task<string> CreatePixPaymentAsync(string asaasCustomerId, decimal amount, string description, CancellationToken ct);
    Task<PixQrCodeResponseDto> GetPixQrCodeAsync(string asaasPaymentId, CancellationToken ct);

    Task RefundPaymentAsync(string asaasPaymentId, CancellationToken ct);

    Task<string> GetPaymentStatusAsync(string asaasPaymentId, CancellationToken ct);
}