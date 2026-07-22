using MediatR;
using FluentValidation;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Theos.Application.Courses.Commands.AssignCategories;

public record AssignCourseCategoriesCommand(int CourseId, List<int> CategoryIds) : IRequest<Unit>;

public class AssignCourseCategoriesCommandValidator : AbstractValidator<AssignCourseCategoriesCommand>
{
    public AssignCourseCategoriesCommandValidator()
    {
        RuleFor(v => v.CourseId).GreaterThan(0).WithMessage("CourseId is required.");
        RuleFor(v => v.CategoryIds).NotNull().WithMessage("CategoryIds cannot be null.");
    }
}

public class AssignCourseCategoriesCommandHandler : IRequestHandler<AssignCourseCategoriesCommand, Unit>
{
    private readonly ITheosDbContext _context;

    public AssignCourseCategoriesCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(AssignCourseCategoriesCommand request, CancellationToken cancellationToken)
    {
        var course = await _context.Courses
            .Include(c => c.CourseCategories)
            .FirstOrDefaultAsync(c => c.Id == request.CourseId, cancellationToken);

        if (course == null)
        {
            throw new InvalidOperationException($"Course with ID {request.CourseId} not found.");
        }

        // Remove old relations
        _context.CourseCourseCategories.RemoveRange(course.CourseCategories);
        
        // Add new relations
        var distinctCategoryIds = request.CategoryIds.Distinct().ToList();
        foreach (var catId in distinctCategoryIds)
        {
            course.CourseCategories.Add(CourseCourseCategory.Create(request.CourseId, catId));
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
