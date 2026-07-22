using MediatR;
using Theos.Application.BlogPosts.DTOs;

namespace Theos.Application.BlogPosts.Queries.GetBlogPostById;

public record GetBlogPostByIdQuery(int Id) : IRequest<BlogPostDto>;
