using MediatR;
using Theos.Application.Common.Models;
using Theos.Application.Portal.Tickets.DTOs;
using Theos.Domain.Enums;

namespace Theos.Application.Portal.Tickets.Queries.GetTickets;

public record GetTicketsQuery(TicketStatus? Status, int? CategoryId, string? SearchText, int PageIndex = 1, int PageSize = 10) : IRequest<PaginatedList<TicketSummaryDto>>;
