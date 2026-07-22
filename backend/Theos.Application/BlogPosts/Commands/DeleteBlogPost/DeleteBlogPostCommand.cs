using MediatR;

namespace Theos.Application.BlogPosts.Commands.DeleteBlogPost;

public record DeleteBlogPostCommand(int Id) : IRequest<Unit>;
