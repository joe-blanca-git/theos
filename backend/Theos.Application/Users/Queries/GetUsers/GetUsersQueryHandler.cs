using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Users.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly ITheosDbContext _context;

    public GetUsersQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .OrderBy(u => u.FullName)
            .Select(u => new UserDto
            {
                Id = u.Id,
                ExternalId = u.ExternalId,
                Name = u.FullName,
                Email = u.Email
            })
            .ToListAsync(cancellationToken);

        return users;
    }
}
