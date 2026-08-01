using MediatR;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.Portal.Forum.Topics.Commands.ResolveForumTopic;

public class ResolveForumTopicCommandHandler : IRequestHandler<ResolveForumTopicCommand>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;

    public ResolveForumTopicCommandHandler(ITheosDbContext context, IUserContextService userContextService)
    {
        _context = context;
        _userContextService = userContextService;
    }

    public async Task Handle(ResolveForumTopicCommand request, CancellationToken cancellationToken)
    {
        var topic = await _context.ForumTopics.FindAsync(new object[] { request.Id }, cancellationToken);

        if (topic == null)
            throw new Theos.Application.Common.Exceptions.NotFoundException("Tópico não encontrado.");

        var currentUser = await _userContextService.GetCurrentUserAsync();
        if (topic.AuthorId != currentUser.Id)
            throw new UnauthorizedAccessException("Somente o autor do tópico pode marcá-lo como resolvido.");

        topic.Resolve();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
