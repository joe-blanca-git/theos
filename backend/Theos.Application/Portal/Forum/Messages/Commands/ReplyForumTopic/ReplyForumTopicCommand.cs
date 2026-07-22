using MediatR;

namespace Theos.Application.Portal.Forum.Messages.Commands.ReplyForumTopic;

public record ReplyForumTopicCommand(int TopicId, string Content) : IRequest<int>;
