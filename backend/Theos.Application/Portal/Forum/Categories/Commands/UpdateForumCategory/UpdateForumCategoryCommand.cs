using MediatR;

namespace Theos.Application.Portal.Forum.Categories.Commands.UpdateForumCategory;

public record UpdateForumCategoryCommand(int Id, string Name, string? Description) : IRequest;
