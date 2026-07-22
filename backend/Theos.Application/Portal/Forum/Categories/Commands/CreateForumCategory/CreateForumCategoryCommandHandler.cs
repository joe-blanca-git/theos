using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.Portal.Forum.Categories.Commands.CreateForumCategory;

public class CreateForumCategoryCommandHandler : IRequestHandler<CreateForumCategoryCommand, int>
{
    private readonly ITheosDbContext _context;

    public CreateForumCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateForumCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = ForumCategory.Create(request.Name, request.Description);

        _context.ForumCategories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
