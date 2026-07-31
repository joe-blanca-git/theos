using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.Tickets.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Tickets.Queries.GetActiveTicketCategories;

public class GetActiveTicketCategoriesQueryHandler : IRequestHandler<GetActiveTicketCategoriesQuery, List<TicketCategoryDto>>
{
    private readonly ITheosDbContext _context;

    public GetActiveTicketCategoriesQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<List<TicketCategoryDto>> Handle(GetActiveTicketCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.TicketCategories
            .Where(c => c.Active)
            .Select(c => new TicketCategoryDto
            {
                Id = c.Id,
                Description = c.Description,
                Icon = c.Icon
            })
            .ToListAsync(cancellationToken);
    }
}
