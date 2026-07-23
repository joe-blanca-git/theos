using MediatR;
using Theos.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

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
        private readonly IBunnyVideoService _bunnyVideoService;

        public DeleteLessonCommandHandler(ITheosDbContext context, IBunnyVideoService bunnyVideoService)
        {
            _context = context;
            _bunnyVideoService = bunnyVideoService;
        }

        public async Task<Unit> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Module)
                .ThenInclude(m => m.Course)
                .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

            if (lesson == null)
                throw new InvalidOperationException($"Aula com ID {request.Id} não encontrada.");

            if (!string.IsNullOrEmpty(lesson.BunnyVideoId) && !string.IsNullOrEmpty(lesson.Module?.Course?.BunnyLibraryId))
            {
                if (int.TryParse(lesson.Module.Course.BunnyLibraryId, out int libraryId))
                {
                    try
                    {
                        await _bunnyVideoService.DeleteVideoAsync(libraryId, lesson.BunnyVideoId, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Erro ao excluir vídeo do Bunny: {ex.Message}");
                    }
                }
            }

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
