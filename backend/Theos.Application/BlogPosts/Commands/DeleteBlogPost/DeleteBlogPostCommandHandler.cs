using MediatR;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.BlogPosts.Commands.DeleteBlogPost;

public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand, Unit>
{
    private readonly ITheosDbContext _context;

    public DeleteBlogPostCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = await _context.BlogPosts.FindAsync(new object[] { request.Id }, cancellationToken);

        if (blogPost == null)
        {
            throw new InvalidOperationException($"Post de blog com ID {request.Id} não encontrado.");
        }

        _context.BlogPosts.Remove(blogPost);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
