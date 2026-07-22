using MediatR;

namespace Theos.Application.Portal.Forum.Topics.Commands.ReopenForumTopic;

public record ReopenForumTopicCommand(int Id) : IRequest;
