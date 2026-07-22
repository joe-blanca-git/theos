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

        public GetTeachersQueryHandler(ITheosDbContext context)
        {
            _context = context;
        }

        public async Task<List<TeacherDto>> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Teachers
                .Where(t => t.Active)
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
