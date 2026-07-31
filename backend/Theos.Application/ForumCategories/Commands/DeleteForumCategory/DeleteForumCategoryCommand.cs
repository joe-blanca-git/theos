using MediatR;
using Theos.Application.Common.Exceptions;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.ForumCategories.Commands.DeleteForumCategory;

public record DeleteForumCategoryCommand(int Id) : IRequest;

public class DeleteForumCategoryCommandHandler : IRequestHandler<DeleteForumCategoryCommand>
{
    private readonly ITheosDbContext _context;

    public DeleteForumCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteForumCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.ForumCategories
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(ForumCategory), request.Id);
        }

        _context.ForumCategories.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
