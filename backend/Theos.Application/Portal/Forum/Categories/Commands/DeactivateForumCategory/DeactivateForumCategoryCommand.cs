using MediatR;

namespace Theos.Application.Portal.Forum.Categories.Commands.DeactivateForumCategory;

public record DeactivateForumCategoryCommand(int Id) : IRequest;
