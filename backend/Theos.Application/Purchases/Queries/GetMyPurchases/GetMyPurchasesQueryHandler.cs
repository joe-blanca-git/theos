using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Purchases.Queries.GetMyPurchases;

public class GetMyPurchasesQueryHandler : IRequestHandler<GetMyPurchasesQuery, List<UserPurchaseDto>>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;

    public GetMyPurchasesQueryHandler(ITheosDbContext context, IUserContextService userContextService)
    {
        _context = context;
        _userContextService = userContextService;
    }

    public async Task<List<UserPurchaseDto>> Handle(GetMyPurchasesQuery request, CancellationToken cancellationToken)
    {
        var currentUser = await _userContextService.GetCurrentUserAsync();

        var purchases = await _context.Purchases
            .Include(p => p.Course)
            .Where(p => p.UserId == currentUser.Id && p.Status != Domain.Enums.PurchaseStatus.Refunded)
            .ToListAsync(cancellationToken);

        return purchases.Select(p => new UserPurchaseDto
        {
            PurchaseId = p.Id,
            CourseId = p.CourseId,
            CourseTitle = p.Course?.Name ?? string.Empty,
            Amount = p.Amount,
            PurchasedAt = p.CreatedAt,
            Status = p.Status.ToString().ToUpper(),
            PaymentMethod = p.PaymentMethod
        }).ToList();
    }
}
