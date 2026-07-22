using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.CourseCategories.Queries.GetCourseCategoryById;

public record GetCourseCategoryByIdQuery(int Id) : IRequest<CourseCategoryDto?>;

public class GetCourseCategoryByIdQueryHandler : IRequestHandler<GetCourseCategoryByIdQuery, CourseCategoryDto?>
{
    private readonly ITheosDbContext _context;

    public GetCourseCategoryByIdQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<CourseCategoryDto?> Handle(GetCourseCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.CourseCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            return null;
        }

        return new CourseCategoryDto(entity.Id, entity.Name, entity.Description, entity.Active);
    }
}
