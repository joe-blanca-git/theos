using MediatR;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.BlogPosts.Commands.UpdateBlogPost;

public class UpdateBlogPostCommandHandler : IRequestHandler<UpdateBlogPostCommand, Unit>
{
    private readonly ITheosDbContext _context;

    public UpdateBlogPostCommandHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateBlogPostCommand request, CancellationToken cancellationToken)
    {
        var blogPost = await _context.BlogPosts.FindAsync(new object[] { request.Id }, cancellationToken);

        if (blogPost == null)
        {
            throw new InvalidOperationException($"Post de blog com ID {request.Id} não encontrado.");
        }

        blogPost.Update(
            request.Title,
            request.Subject,
            request.Content,
            request.Tags,
            request.HeaderImageUrl
        );

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
