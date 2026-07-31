using MediatR;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Domain.Enums;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Portal.Tickets.Commands.CreateTicket;

public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, int>
{
    private readonly ITheosDbContext _context;
    private readonly IUserContextService _userContextService;
    private readonly IEmailService _emailService;

    public CreateTicketCommandHandler(ITheosDbContext context, IUserContextService userContextService, IEmailService emailService)
    {
        _context = context;
        _userContextService = userContextService;
        _emailService = emailService;
    }

    public async Task<int> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        var user = await _userContextService.GetCurrentUserAsync();

        var ticket = Ticket.Create(user.Id, request.CategoryId, request.Subject, TicketPriority.Normal);
        
        var message = TicketMessage.Create(ticket.Id, user.Id, TicketOrigin.Portal, request.Content, null);
        ticket.Messages.Add(message);

        var timeline = TicketTimeline.Create(ticket.Id, user.Id, TicketTimelineEvent.Created, "Ticket criado.");
        ticket.Timelines.Add(timeline);

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync(cancellationToken);

        // Send Email (Fire and forget or awaited)
        await _emailService.SendTicketCreatedAsync(ticket.Id, user.Email ?? "", user.FullName ?? "Aluno", ticket.Subject);

        return ticket.Id;
    }
}
