using MediatR;

namespace Theos.Application.Portal.Forum.Topics.Queries.GetForumTopicById;

public record GetForumTopicByIdQuery(int Id) : IRequest<ForumTopicDetailDto>;
