using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.SupportAccess.Commands.RevokeCourseAccess;

public class RevokeCourseAccessCommandHandler : IRequestHandler<RevokeCourseAccessCommand, bool>
{
    private readonly ITheosDbContext _context;

    public RevokeCourseAccessCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RevokeCourseAccessCommand request, CancellationToken cancellationToken)
    {
        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.CourseId == request.CourseId, cancellationToken);

        if (enrollment != null && enrollment.Active)
        {
            enrollment.Deactivate();
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        return false;
    }
}
