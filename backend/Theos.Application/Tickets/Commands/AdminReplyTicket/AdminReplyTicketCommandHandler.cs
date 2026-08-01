using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Tickets.Commands.AdminReplyTicket;

public class AdminReplyTicketCommandHandler : IRequestHandler<AdminReplyTicketCommand, int>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;
    private readonly IEmailService _emailService;

    public AdminReplyTicketCommandHandler(ITheosDbContext context, IUserContextService userContextService, IEmailService emailService)
    {
        _context = context;
        _userContextService = userContextService;
        _emailService = emailService;
    }

    public async Task<int> Handle(AdminReplyTicketCommand request, CancellationToken cancellationToken)
    {
        var admin = await _userContextService.GetCurrentUserAsync();

        var ticket = await _context.Tickets
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);

        if (ticket == null) return 0;

        ticket.UpdateLastReply();
        if (ticket.Status == TicketStatus.Closed)
        {
            ticket.UpdateStatus(TicketStatus.Open);
            _context.TicketTimelines.Add(TicketTimeline.Create(ticket.Id, admin.Id, TicketTimelineEvent.Reopened, "Ticket reaberto via nova resposta do suporte."));
        }

        var message = TicketMessage.Create(ticket.Id, admin.Id, TicketOrigin.Backoffice, request.Content, null);
        _context.TicketMessages.Add(message);

        _context.TicketTimelines.Add(TicketTimeline.Create(ticket.Id, admin.Id, TicketTimelineEvent.Replied, "Ticket respondido pelo suporte."));

        await _context.SaveChangesAsync(cancellationToken);

        await _emailService.SendTicketReplyAsync(ticket.Id, ticket.User.Email ?? "", ticket.User.FullName ?? "Aluno", request.Content);

        return message.Id;
    }
}
