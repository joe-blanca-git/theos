using MediatR;
using Theos.Application.Tickets.DTOs;
namespace Theos.Application.Tickets.Queries.GetTicketStats;
public record GetTicketStatsQuery() : IRequest<TicketStatsDto>;
