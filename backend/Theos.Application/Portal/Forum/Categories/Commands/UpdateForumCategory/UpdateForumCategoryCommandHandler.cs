using MediatR;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Portal.Forum.Categories.Commands.UpdateForumCategory;

public class UpdateForumCategoryCommandHandler : IRequestHandler<UpdateForumCategoryCommand>
{
    private readonly ITheosDbContext _context;

    public UpdateForumCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateForumCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.ForumCategories.FindAsync(new object[] { request.Id }, cancellationToken);

        if (category == null)
            throw new Exception("Categoria nÃ£o encontrada.");

        category.Update(request.Name, request.Description, request.Icon);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

