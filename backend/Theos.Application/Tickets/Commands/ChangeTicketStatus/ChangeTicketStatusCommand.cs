using MediatR;
using Theos.Domain.Enums;
namespace Theos.Application.Tickets.Commands.ChangeTicketStatus;
public record ChangeTicketStatusCommand(int TicketId, TicketStatus Status) : IRequest<bool>;
