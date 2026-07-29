using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.Teachers.Common;

namespace Theos.Application.Teachers.Queries.GetTeachers
{
    public record GetTeachersQuery : IRequest<List<TeacherDto>>;

    public class GetTeachersQueryHandler : IRequestHandler<GetTeachersQuery, List<TeacherDto>>
    {
        private readonly ITheosDbContext _context;
        private readonly IUserContextService _userContextService;

        public GetTeachersQueryHandler(ITheosDbContext context, IUserContextService userContextService)
        {
            _context = context;
            _userContextService = userContextService;
        }

        public async Task<List<TeacherDto>> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
        {
            var currentUser = await _userContextService.GetCurrentUserAsync();
            var loggedTeacher = await _context.Teachers.FirstOrDefaultAsync(t => t.IdAgivys == currentUser.ExternalId, cancellationToken);

            if (loggedTeacher == null)
            {
                return new List<TeacherDto>();
            }

            var query = _context.Teachers.Where(t => t.Active);

            if (loggedTeacher.Role != "Admin")
            {
                query = query.Where(t => t.Id == loggedTeacher.Id);
            }

            return await query
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Role = t.Role,
                    Position = t.Position,
                    Avatar = t.Avatar,
                    Bio = t.Bio,
                    InstagramLink = t.InstagramLink,
                    LinkedinLink = t.LinkedinLink,
                    IdAgivys = t.IdAgivys
                })
                .ToListAsync(cancellationToken);
        }
    }
}
