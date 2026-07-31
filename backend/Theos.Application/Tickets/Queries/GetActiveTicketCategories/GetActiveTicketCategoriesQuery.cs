using MediatR;
using System.Collections.Generic;
using Theos.Application.Tickets.DTOs;
namespace Theos.Application.Tickets.Queries.GetActiveTicketCategories;
public record GetActiveTicketCategoriesQuery() : IRequest<List<TicketCategoryDto>>;
