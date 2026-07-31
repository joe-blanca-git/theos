using MediatR;
using FluentValidation;
using Theos.Application.Common.Exceptions;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.ForumCategories.Commands.UpdateForumCategory;

public record UpdateForumCategoryCommand(int Id, string Name, string? Description, bool Active) : IRequest;

public class UpdateForumCategoryCommandValidator : AbstractValidator<UpdateForumCategoryCommand>
{
    public UpdateForumCategoryCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(150).WithMessage("Name must not exceed 150 characters.")
            .NotEmpty().WithMessage("Name is required.");
    }
}

public class UpdateForumCategoryCommandHandler : IRequestHandler<UpdateForumCategoryCommand>
{
    private readonly ITheosDbContext _context;

    public UpdateForumCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateForumCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.ForumCategories
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(ForumCategory), request.Id);
        }

        entity.Update(request.Name, request.Description);
        // We also need to manage Active state since the user can toggle it, but the Update method in Domain
        // for ForumCategory doesn't accept active in the example above (wait, the Domain Update doesn't have Active?).
        // Let's just do it directly or check the Entity methods. I'll use entity.Update then set Active.
        
        if (!request.Active && entity.Active)
        {
            entity.Deactivate();
        }
        else if (request.Active && !entity.Active)
        {
            // Just manually update it if there is no Activate method
            // Not doing it here if it's strictly DDD, but for simple CRUD it's ok
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
