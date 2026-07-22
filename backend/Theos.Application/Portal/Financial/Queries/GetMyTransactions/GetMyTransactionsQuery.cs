using MediatR;

namespace Theos.Application.Portal.Financial.Queries.GetMyTransactions;

public record GetMyTransactionsQuery() : IRequest<List<GetMyTransactionsResponseDto>>;
