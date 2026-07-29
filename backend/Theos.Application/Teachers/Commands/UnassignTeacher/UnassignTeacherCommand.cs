using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Teachers.Commands.UnassignTeacher
{
    public record UnassignTeacherResult(bool Success, string Message);

    public record UnassignTeacherCommand : IRequest<UnassignTeacherResult>
    {
        public int TeacherId { get; init; }
        public int CourseId { get; init; }
    }

    public class UnassignTeacherCommandHandler : IRequestHandler<UnassignTeacherCommand, UnassignTeacherResult>
    {
        private readonly ITheosDbContext _context;

        public UnassignTeacherCommandHandler(ITheosDbContext context)
        {
            _context = context;
        }

        public async Task<UnassignTeacherResult> Handle(UnassignTeacherCommand request, CancellationToken cancellationToken)
        {
            var courseTeacher = await _context.CourseTeachers
                .FirstOrDefaultAsync(ct => ct.TeacherId == request.TeacherId && ct.CourseId == request.CourseId, cancellationToken);

            if (courseTeacher == null)
                return new UnassignTeacherResult(false, "O vínculo entre o professor e o curso não foi encontrado.");

            _context.CourseTeachers.Remove(courseTeacher);
            await _context.SaveChangesAsync(cancellationToken);

            return new UnassignTeacherResult(true, "Professor desvinculado com sucesso.");
        }
    }
}
