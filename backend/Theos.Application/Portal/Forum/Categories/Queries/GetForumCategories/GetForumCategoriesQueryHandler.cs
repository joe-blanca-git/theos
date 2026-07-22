using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Portal.Forum.Categories.Queries.GetForumCategories;

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
            .AsNoTracking()
            .Select(c => new ForumCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Active = c.Active
            })
            .ToListAsync(cancellationToken);
    }
}
