using MediatR;
using Theos.Application.BlogPosts.DTOs;

namespace Theos.Application.BlogPosts.Queries.GetBlogPosts;

public record GetBlogPostsQuery : IRequest<List<BlogPostDto>>;
