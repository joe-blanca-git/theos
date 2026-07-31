using MediatR;

namespace Theos.Application.Portal.Tickets.Commands.ReplyTicket;

public record ReplyTicketCommand(int TicketId, string Content) : IRequest<int>;
