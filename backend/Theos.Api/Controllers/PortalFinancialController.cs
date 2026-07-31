using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Theos.Application.Portal.Financial.Queries.GetMyTransactions;

namespace Theos.Api.Controllers;

[Authorize]
[Route("api/v1/financial")]
[Tags("Portal Pan - Financeiro")]
public class PortalFinancialController : ApiControllerBase
{
    [HttpGet("transactions")]
    public async Task<IActionResult> GetMyTransactions()
    {
        var result = await Mediator.Send(new GetMyTransactionsQuery());
        return Ok(result);
    }
}
