using MediatR;
using Theos.Application.Tickets.DTOs;
namespace Theos.Application.Tickets.Queries.GetTicketDashboard;
public record GetTicketDashboardQuery() : IRequest<TicketDashboardDto>;
