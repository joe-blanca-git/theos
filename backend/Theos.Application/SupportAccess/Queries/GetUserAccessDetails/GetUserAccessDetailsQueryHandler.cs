using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.SupportAccess.Queries.GetUserAccessDetails;

public class GetUserAccessDetailsQueryHandler : IRequestHandler<GetUserAccessDetailsQuery, List<SupportCourseAccessDto>>
{
    private readonly ITheosDbContext _context;

    public GetUserAccessDetailsQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<List<SupportCourseAccessDto>> Handle(GetUserAccessDetailsQuery request, CancellationToken cancellationToken)
    {
        var courses = await _context.Courses
            .Where(c => c.Active)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);

        var enrollments = await _context.Enrollments
            .Where(e => e.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        var purchases = await _context.Purchases
            .Where(p => p.UserId == request.UserId && p.Status == Theos.Domain.Enums.PurchaseStatus.Approved)
            .ToListAsync(cancellationToken);

        var result = new List<SupportCourseAccessDto>();

        foreach (var course in courses)
        {
            var enrollment = enrollments.FirstOrDefault(e => e.CourseId == course.Id && e.Active);
            var purchase = purchases.FirstOrDefault(p => p.CourseId == course.Id);

            result.Add(new SupportCourseAccessDto
            {
                Id = course.Id,
                Name = course.Name,
                AccessStatus = enrollment != null ? "Liberado" : "Bloqueado",
                PurchaseValue = purchase?.Amount,
                PaymentMethod = purchase?.PaymentMethod
            });
        }

        return result;
    }
}
