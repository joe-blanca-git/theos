using MediatR;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Courses.Commands.DeleteLesson
{
    /// <summary>
    /// Comando para deletar permanentemente uma aula.
    /// </summary>
    public record DeleteLessonCommand : IRequest<Unit>
    {
        /// <summary>ID da aula a ser deletada.</summary>
        /// <example>1</example>
        public int Id { get; init; }
    }

    public class DeleteLessonCommandHandler : IRequestHandler<DeleteLessonCommand, Unit>
    {
        private readonly ITheosDbContext _context;

        public DeleteLessonCommandHandler(ITheosDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
        {
            var lesson = await _context.Lessons.FindAsync(new object[] { request.Id }, cancellationToken: cancellationToken);
            if (lesson == null)
                throw new InvalidOperationException($"Aula com ID {request.Id} não encontrada.");

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
