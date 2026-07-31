using MediatR;
using Theos.Application.Tickets.DTOs;
namespace Theos.Application.Tickets.Queries.GetAdminTicketDetails;
public record GetAdminTicketDetailsQuery(int Id) : IRequest<TicketAdminDetailsDto?>;
