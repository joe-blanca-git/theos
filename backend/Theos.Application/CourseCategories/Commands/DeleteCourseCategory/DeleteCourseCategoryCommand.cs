using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.CourseCategories.Commands.DeleteCourseCategory;

public record DeleteCourseCategoryCommand(int Id) : IRequest<Unit>;

public class DeleteCourseCategoryCommandHandler : IRequestHandler<DeleteCourseCategoryCommand, Unit>
{
    private readonly ITheosDbContext _context;

    public DeleteCourseCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCourseCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CourseCategories.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new InvalidOperationException($"CourseCategory with ID {request.Id} not found.");
        }

        _context.CourseCategories.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
