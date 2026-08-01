using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.ForumCategories.Queries;

namespace Theos.Application.ForumCategories.Queries.GetForumCategories;

public record GetForumCategoriesQuery() : IRequest<List<ForumCategoryDto>>;

public class GetForumCategoriesQueryHandler : IRequestHandler<GetForumCategoriesQuery, List<ForumCategoryDto>>
{
    private readonly ITheosDbContext _context;

    public GetForumCategoriesQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<List<ForumCategoryDto>> Handle(GetForumCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ForumCategories
            .OrderBy(x => x.Name)
            .Select(x => new ForumCategoryDto(x.Id, x.Name, x.Description, x.Active, x.Icon))
            .ToListAsync(cancellationToken);
    }
}
