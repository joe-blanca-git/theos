using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.BlogPosts.DTOs;
using Theos.Application.Common.Interfaces;

namespace Theos.Application.BlogPosts.Queries.GetBlogPostById;

public class GetBlogPostByIdQueryHandler : IRequestHandler<GetBlogPostByIdQuery, BlogPostDto>
{
    private readonly ITheosDbContext _context;

    public GetBlogPostByIdQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<BlogPostDto> Handle(GetBlogPostByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await (from b in _context.BlogPosts
                            join u in _context.Users on b.AuthorId equals u.Id into userGroup
                            from u in userGroup.DefaultIfEmpty()
                            where b.Id == request.Id
                            select new
                            {
                                Post = b,
                                AuthorName = u != null ? u.FullName : null
                            })
                            .AsNoTracking()
                            .FirstOrDefaultAsync(cancellationToken);

        if (result == null)
        {
            throw new InvalidOperationException($"Post de blog com ID {request.Id} não encontrado.");
        }

        var blogPost = result.Post;

        return new BlogPostDto(
            blogPost.Id,
            blogPost.AuthorId,
            result.AuthorName,
            blogPost.Title,
            blogPost.Subject,
            blogPost.Content,
            blogPost.Tags,
            blogPost.HeaderImageUrl,
            blogPost.CreatedAt,
            blogPost.UpdatedAt
        );
    }
}
