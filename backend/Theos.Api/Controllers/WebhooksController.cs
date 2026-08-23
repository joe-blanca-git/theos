using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Theos.Application.Common.Models.Bunny;
using Theos.Application.Webhooks.Commands.ProcessBunnyWebhook;
using System.Threading.Tasks;

namespace Theos.Api.Controllers
{
    [ApiController]
    [Route("api/v1/webhooks")]
    [Tags("Webhooks Externos")]
    public class WebhooksController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly ILogger<WebhooksController> _logger;

        public WebhooksController(IMediator mediator, IConfiguration configuration, ILogger<WebhooksController> logger)
        {
            _mediator = mediator;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("asaas")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public async Task<IActionResult> AsaasWebhook()
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;

            using var reader = new System.IO.StreamReader(Request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            Request.Body.Position = 0;

            if (string.IsNullOrWhiteSpace(body))
            {
                _logger.LogWarning("[WEBHOOK ASAAS] Recebeu payload vazio. Retornando 200 OK para evitar penalizações.");
                return Ok(new { message = "Payload vazio ignorado" });
            }

            _logger.LogInformation($"[WEBHOOK ASAAS] Recebido payload: {body}");
            try
            {
                using var document = System.Text.Json.JsonDocument.Parse(body);
                var payload = document.RootElement;

                string? eventType = null;
                string? paymentId = null;

                if (payload.TryGetProperty("event", out var eventProp))
                    eventType = eventProp.GetString();

                if (payload.TryGetProperty("payment", out var paymentProp) && paymentProp.TryGetProperty("id", out var idProp))
                    paymentId = idProp.GetString();

                if (string.IsNullOrEmpty(eventType) || string.IsNullOrEmpty(paymentId))
                {
                    _logger.LogWarning($"[WEBHOOK ASAAS] Payload não contém event ou payment.id. Event: {eventType}, PaymentId: {paymentId}");
                    return Ok(new { message = "Payload ignorado (incompatível)" });
                }

                var command = new Theos.Application.Webhooks.Commands.ProcessAsaasWebhookCommand
                {
                    Event = eventType,
                    PaymentId = paymentId
                };

                var result = await _mediator.Send(command);

                return Ok(new { success = result });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "[WEBHOOK ASAAS] Erro ao processar webhook.");
                return Ok(new { message = "Erro interno ao processar webhook, retornado OK." });
            }
        }

        [HttpPost("bunny")]
        public async Task<IActionResult> BunnyWebhook([FromBody] BunnyWebhookPayload payload)
        {
            // CRÍTICO: Validar a assinatura e origem do webhook conforme o plano
            // A Bunny Stream permite passar parâmetros de segurança via Header ou QueryString na configuração do Webhook
            // Recomendação: Configurar a URL do webhook na Bunny como https://api.theos.com/api/v1/webhooks/bunny?secret=YOUR_SECRET
            // ou validar um cabeçalho customizado.
            
            var configuredSecret = _configuration["BunnyNets:WebhookSecret"];
            if (string.IsNullOrEmpty(configuredSecret))
            {
                // Se não houver secret configurado no sistema, rejeitamos a requisição por segurança
                return Unauthorized(new { message = "WebhookSecret não configurado no servidor." });
            }

            // Exemplo de validação via Header (se configurado na Bunny para enviar X-Bunny-Signature)
            var hasHeader = Request.Headers.TryGetValue("X-Bunny-Signature", out var headerSignature);
            
            // Exemplo de validação via Query String
            var hasQuery = Request.Query.TryGetValue("secret", out var querySecret);

            bool isValid = false;

            if (hasHeader && headerSignature.ToString() == configuredSecret)
                isValid = true;
                
            if (hasQuery && querySecret.ToString() == configuredSecret)
                isValid = true;

            if (!isValid)
            {
                return Unauthorized(new { message = "Assinatura do Webhook inválida." });
            }

            var command = new ProcessBunnyWebhookCommand { Payload = payload };
            var result = await _mediator.Send(command);

            if (!result)
            {
                // Retornar OK mesmo se a Lesson não for encontrada evita que a Bunny fique tentando reenviar o webhook
                return Ok(new { message = "Vídeo não encontrado ou não gerenciado." });
            }

            return Ok(new { message = "Webhook processado com sucesso." });
        }
    }
}
