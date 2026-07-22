using MediatR;
using System.Collections.Generic;

namespace Theos.Application.Purchases.Queries.GetMyPurchases;

public record GetMyPurchasesQuery() : IRequest<List<UserPurchaseDto>>;
