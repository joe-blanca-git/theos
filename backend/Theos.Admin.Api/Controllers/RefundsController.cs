using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Theos.Application.Refunds.Commands;
using Theos.Application.Refunds.Queries;

namespace Theos.Admin.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class RefundsController : ControllerBase
{
    private readonly IMediator _mediator;

    public RefundsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("Summary")]
    public async Task<IActionResult> GetSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await _mediator.Send(new GetRefundSummaryQuery(startDate, endDate));
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetRefunds([FromQuery] string? status, [FromQuery] string? searchTerm, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await _mediator.Send(new GetRefundsQuery(status, searchTerm, startDate, endDate));
        return Ok(result);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        await _mediator.Send(new ApproveRefundCommand(id));
        return Ok(new { Message = "Solicitação aprovada com sucesso." });
    }

    public record RejectRequest(string Reason);

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectRequest request)
    {
        await _mediator.Send(new RejectRefundCommand(id, request.Reason));
        return Ok(new { Message = "Solicitação reprovada com sucesso." });
    }

    [HttpPost("{id}/execute")]
    public async Task<IActionResult> Execute(int id)
    {
        await _mediator.Send(new ExecuteRefundCommand(id));
        return Ok(new { Message = "Reembolso executado com sucesso." });
    }
}
