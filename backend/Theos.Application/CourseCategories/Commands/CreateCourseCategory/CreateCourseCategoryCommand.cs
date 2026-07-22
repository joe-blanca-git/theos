using MediatR;
using FluentValidation;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.CourseCategories.Commands.CreateCourseCategory;

public record CreateCourseCategoryCommand(string Name, string? Description) : IRequest<int>;

public class CreateCourseCategoryCommandValidator : AbstractValidator<CreateCourseCategoryCommand>
{
    public CreateCourseCategoryCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(150).WithMessage("Name must not exceed 150 characters.")
            .NotEmpty().WithMessage("Name is required.");
    }
}

public class CreateCourseCategoryCommandHandler : IRequestHandler<CreateCourseCategoryCommand, int>
{
    private readonly ITheosDbContext _context;

    public CreateCourseCategoryCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCourseCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = CourseCategory.Create(request.Name, request.Description);

        _context.CourseCategories.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
