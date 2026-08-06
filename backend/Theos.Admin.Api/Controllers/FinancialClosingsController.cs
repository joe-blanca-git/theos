using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Theos.Application.FinancialClosings.Queries;

namespace Theos.Admin.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class FinancialClosingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FinancialClosingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Obtém o resumo financeiro global do professor logado (Dashboard).
        /// </summary>
        [HttpGet("Summary")]
        [SwaggerOperation(Summary = "Resumo financeiro", Description = "Retorna os totais disponíveis, pendentes e já sacados do professor autenticado.")]
        [ProducesResponseType(typeof(FinancialDashboardSummaryDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSummary()
        {
            var result = await _mediator.Send(new GetFinancialDashboardSummaryQuery());
            return Ok(result);
        }

        /// <summary>
        /// Simula um fechamento com base nas vendas elegíveis (mais antigas que 7 dias).
        /// </summary>
        [HttpGet("Simulate")]
        [SwaggerOperation(Summary = "Simula fechamento de vendas", Description = "Busca as vendas elegíveis e calcula os repasses detalhados sem salvar nada no banco de dados.")]
        [ProducesResponseType(typeof(FinancialClosingSimulationDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> Simulate()
        {
            var result = await _mediator.Send(new SimulateProfessorClosingQuery());
            return Ok(result);
        }
    }
}
