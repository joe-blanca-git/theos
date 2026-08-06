using Theos.Domain.Common;
using Theos.Domain.Enums;

namespace Theos.Domain.Entities;

public class FinancialTax : BaseEntity
{
    public TaxType Type { get; private set; }
    public decimal Percentage { get; private set; }
    public DateTime EffectiveFrom { get; private set; }
    public bool IsActive { get; private set; }

    private FinancialTax() { }

    public FinancialTax(TaxType type, decimal percentage, DateTime effectiveFrom)
    {
        Type = type;
        Percentage = percentage;
        EffectiveFrom = effectiveFrom;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdatePercentage(decimal newPercentage, DateTime newEffectiveFrom)
    {
        Percentage = newPercentage;
        EffectiveFrom = newEffectiveFrom;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ToggleStatus()
    {
        IsActive = !IsActive;
        UpdatedAt = DateTime.UtcNow;
    }
}
