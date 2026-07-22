using MediatR;

namespace Theos.Application.Lessons.Commands.ToggleLessonView;

public record ToggleLessonViewCommand(int LessonId) : IRequest<bool>;
