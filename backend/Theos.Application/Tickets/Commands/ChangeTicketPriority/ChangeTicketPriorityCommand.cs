using MediatR;
using Theos.Domain.Enums;
namespace Theos.Application.Tickets.Commands.ChangeTicketPriority;
public record ChangeTicketPriorityCommand(int TicketId, TicketPriority Priority) : IRequest<bool>;
