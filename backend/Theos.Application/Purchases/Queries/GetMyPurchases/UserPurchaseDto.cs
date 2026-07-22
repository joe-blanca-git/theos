using System;

namespace Theos.Application.Purchases.Queries.GetMyPurchases;

public class UserPurchaseDto
{
    public int PurchaseId { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime PurchasedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
}
