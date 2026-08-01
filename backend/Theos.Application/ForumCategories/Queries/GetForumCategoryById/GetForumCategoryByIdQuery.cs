using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Application.ForumCategories.Queries;

namespace Theos.Application.ForumCategories.Queries.GetForumCategoryById;

public record GetForumCategoryByIdQuery(int Id) : IRequest<ForumCategoryDto?>;

public class GetForumCategoryByIdQueryHandler : IRequestHandler<GetForumCategoryByIdQuery, ForumCategoryDto?>
{
    private readonly ITheosDbContext _context;

    public GetForumCategoryByIdQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<ForumCategoryDto?> Handle(GetForumCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.ForumCategories
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            return null;

        return new ForumCategoryDto(entity.Id, entity.Name, entity.Description, entity.Active, entity.Icon);
    }
}
