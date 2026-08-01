using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.SupportAccess.Queries.GetSupportUsers;

public class GetSupportUsersQueryHandler : IRequestHandler<GetSupportUsersQuery, List<SupportUserDto>>
{
    private readonly ITheosDbContext _context;

    public GetSupportUsersQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<List<SupportUserDto>> Handle(GetSupportUsersQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .Select(u => new SupportUserDto
            {
                Id = u.Id,
                Name = u.FullName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                EnrolledCoursesCount = _context.Enrollments.Count(e => e.UserId == u.Id && e.Active)
            })
            .OrderBy(u => u.Name)
            .ToListAsync(cancellationToken);
    }
}
