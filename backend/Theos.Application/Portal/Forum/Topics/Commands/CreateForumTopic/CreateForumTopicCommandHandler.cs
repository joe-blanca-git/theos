using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;

namespace Theos.Application.Portal.Forum.Topics.Commands.CreateForumTopic;

public class CreateForumTopicCommandHandler : IRequestHandler<CreateForumTopicCommand, int>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;

    public CreateForumTopicCommandHandler(ITheosDbContext context, IUserContextService userContextService)
    {
        _context = context;
        _userContextService = userContextService;
    }

    public async Task<int> Handle(CreateForumTopicCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await _userContextService.GetCurrentUserAsync();

        var topic = ForumTopic.Create(request.CategoryId, request.LessonId, request.Title, request.Subject, request.Content, currentUser.Id);

        _context.ForumTopics.Add(topic);
        await _context.SaveChangesAsync(cancellationToken);

        return topic.Id;
    }
}
