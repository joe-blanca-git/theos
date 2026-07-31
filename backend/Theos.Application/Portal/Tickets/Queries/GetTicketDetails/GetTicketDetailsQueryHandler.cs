using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.Portal.Tickets.DTOs;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Portal.Tickets.Queries.GetTicketDetails;

public class GetTicketDetailsQueryHandler : IRequestHandler<GetTicketDetailsQuery, TicketDetailsDto?>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;
    private readonly IFileStorageService _fileStorageService;

    public GetTicketDetailsQueryHandler(ITheosDbContext context, IUserContextService userContextService, IFileStorageService fileStorageService)
    {
        _context = context;
        _userContextService = userContextService;
        _fileStorageService = fileStorageService;
    }

    public async Task<TicketDetailsDto?> Handle(GetTicketDetailsQuery request, CancellationToken cancellationToken)
    {
        var user = await _userContextService.GetCurrentUserAsync();

        var ticket = await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.Timelines)
            .Include(t => t.Messages)
                .ThenInclude(m => m.Attachments)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == request.Id && t.UserId == user.Id, cancellationToken);

        if (ticket == null) return null;

        var dto = new TicketDetailsDto
        {
            Id = ticket.Id,
            Subject = ticket.Subject,
            Status = ticket.Status.ToString(),
            Priority = ticket.Priority.ToString(),
            CategoryName = ticket.Category.Description,
            CreatedAt = ticket.CreatedAt,
            ClosedAt = ticket.ClosedAt,
            Timeline = ticket.Timelines.OrderBy(tl => tl.CreatedAt).Select(tl => new TicketTimelineDto
            {
                Id = tl.Id,
                Event = tl.Event.ToString(),
                Description = tl.Description,
                CreatedAt = tl.CreatedAt
            }).ToList(),
            Messages = new System.Collections.Generic.List<TicketMessageDto>()
        };

        foreach (var msg in ticket.Messages.OrderBy(m => m.CreatedAt))
        {
            var msgDto = new TicketMessageDto
            {
                Id = msg.Id,
                Origin = msg.Origin.ToString(),
                Content = msg.Content,
                CreatedAt = msg.CreatedAt
            };

            foreach (var att in msg.Attachments)
            {
                msgDto.Attachments.Add(new TicketAttachmentDto
                {
                    Id = att.Id,
                    OriginalFileName = att.OriginalFileName,
                    // In a real scenario, you'd generate a temporary URL here
                    Url = _fileStorageService.GenerateTemporaryUrlAsync(att.Bucket, att.Path, 60).GetAwaiter().GetResult()
                });
            }

            dto.Messages.Add(msgDto);
        }

        return dto;
    }
}
