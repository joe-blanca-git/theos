using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.Portal.Financial.Queries.GetMyTransactions;

public class GetMyTransactionsQueryHandler : IRequestHandler<GetMyTransactionsQuery, List<GetMyTransactionsResponseDto>>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;

    public GetMyTransactionsQueryHandler(ITheosDbContext context, IUserContextService userContextService)
    {
        _context = context;
        _userContextService = userContextService;
    }

    public async Task<List<GetMyTransactionsResponseDto>> Handle(GetMyTransactionsQuery request, CancellationToken cancellationToken)
    {
        var currentUser = await _userContextService.GetCurrentUserAsync();

        var purchases = await _context.Purchases
            .Include(p => p.Course)
            .AsNoTracking()
            .Where(p => p.UserId == currentUser.Id)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        return purchases.Select(p => new GetMyTransactionsResponseDto
        {
            Id = p.Id,
            Name = $"Compra do curso {p.Course?.Name}",
            Value = p.Amount,
            PaymentMethod = p.PaymentMethod,
            Status = p.Status.ToString(), // Pode mapear para português se desejar depois
            PaymentDate = p.CreatedAt,
            TransactionCode = p.AsaasPaymentId ?? $"THEOS-{p.Id}",
            CourseId = p.CourseId
        }).ToList();
    }
}
