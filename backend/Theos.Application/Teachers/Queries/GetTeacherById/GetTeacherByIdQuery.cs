using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.Teachers.Common;

namespace Theos.Application.Teachers.Queries.GetTeacherById
{
    public record GetTeacherByIdQuery : IRequest<TeacherDto?>
    {
        public int Id { get; init; }
    }

    public class GetTeacherByIdQueryHandler : IRequestHandler<GetTeacherByIdQuery, TeacherDto?>
    {
        private readonly ITheosDbContext _context;

        public GetTeacherByIdQueryHandler(ITheosDbContext context)
        {
            _context = context;
        }

        public async Task<TeacherDto?> Handle(GetTeacherByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Teachers
                .Where(t => t.Id == request.Id && t.Active)
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
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
