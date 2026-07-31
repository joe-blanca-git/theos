using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Tickets.Commands.ChangeTicketPriority;

public class ChangeTicketPriorityCommandHandler : IRequestHandler<ChangeTicketPriorityCommand, bool>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;

    public ChangeTicketPriorityCommandHandler(ITheosDbContext context, IUserContextService userContextService)
    {
        _context = context;
        _userContextService = userContextService;
    }

    public async Task<bool> Handle(ChangeTicketPriorityCommand request, CancellationToken cancellationToken)
    {
        var admin = await _userContextService.GetCurrentUserAsync();
        var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);
        if (ticket == null) return false;
        
        var oldPriority = ticket.Priority;
        ticket.UpdatePriority(request.Priority);
        
        _context.TicketTimelines.Add(TicketTimeline.Create(ticket.Id, admin.Id, TicketTimelineEvent.PriorityChanged, $"Prioridade alterada de '{oldPriority}' para '{request.Priority}'."));

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
