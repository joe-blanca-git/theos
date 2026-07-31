using MediatR;
using Theos.Application.Portal.Tickets.DTOs;

namespace Theos.Application.Portal.Tickets.Queries.GetTicketDetails;

public record GetTicketDetailsQuery(int Id) : IRequest<TicketDetailsDto?>;
