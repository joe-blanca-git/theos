using MediatR;

namespace Theos.Application.Portal.Forum.Categories.Queries.GetForumCategories;

public record GetForumCategoriesQuery() : IRequest<List<ForumCategoryDto>>;
