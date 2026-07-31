using MediatR;
using Theos.Application.Portal.Tickets.DTOs;
using System.Collections.Generic;

namespace Theos.Application.Portal.Tickets.Queries.GetTicketTimeline;

public record GetTicketTimelineQuery(int TicketId) : IRequest<List<TicketTimelineDto>?>;
