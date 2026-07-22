using MediatR;

namespace Theos.Application.Portal.Forum.Topics.Commands.ResolveForumTopic;

public record ResolveForumTopicCommand(int Id) : IRequest;
