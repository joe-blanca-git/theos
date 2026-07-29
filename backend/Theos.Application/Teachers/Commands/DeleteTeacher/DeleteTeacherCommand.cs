using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Teachers.Commands.DeleteTeacher
{
    public record DeleteTeacherCommand : IRequest<bool>
    {
        public int Id { get; init; }
        public int? CurrentUserId { get; init; }
    }

    public class DeleteTeacherCommandHandler : IRequestHandler<DeleteTeacherCommand, bool>
    {
        private readonly ITheosDbContext _context;
        private readonly IUserContextService _userContextService;

        public DeleteTeacherCommandHandler(ITheosDbContext context, IUserContextService userContextService)
        {
            _context = context;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
        {
            var currentUser = await _userContextService.GetCurrentUserAsync();
            var loggedTeacher = await _context.Teachers.FirstOrDefaultAsync(t => t.IdAgivys == currentUser.ExternalId, cancellationToken);

            if (loggedTeacher == null || loggedTeacher.Role != "Admin")
            {
                return false; // Only Admin can delete
            }

            var teacher = await _context.Teachers.FindAsync(new object[] { request.Id }, cancellationToken);

            if (teacher == null || !teacher.Active)
            {
                return false;
            }

            teacher.Active = false; // Soft delete
            teacher.UpdatedBy = request.CurrentUserId;
            teacher.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
