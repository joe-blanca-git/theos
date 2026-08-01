using MediatR;
using Theos.Application.Common.Models;
using Theos.Application.Tickets.DTOs;
using Theos.Domain.Enums;
using System;

namespace Theos.Application.Tickets.Queries.GetAdminTickets;

public record GetAdminTicketsQuery(TicketStatus? Status, int? CategoryId, TicketPriority? Priority, int? StudentId, string? SearchText, DateTime? StartDate, DateTime? EndDate, bool? NoReplyOnly, int PageIndex = 1, int PageSize = 10) : IRequest<PaginatedList<TicketAdminSummaryDto>>;
