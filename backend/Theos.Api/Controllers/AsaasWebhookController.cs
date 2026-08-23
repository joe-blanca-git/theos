using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Theos.Application.Webhooks.Commands;
using System.Text.Json;

namespace Theos.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/webhooks/asaas")]
public class AsaasWebhookController : ApiControllerBase
{
    private readonly ILogger<AsaasWebhookController> _logger;

    public AsaasWebhookController(ILogger<AsaasWebhookController> logger)
    {
        _logger = logger;
    }

    // A rota do webhook geralmente não deve exigir [Authorize] porque o Asaas que faz a chamada de fora
    [HttpPost]
    public async Task<IActionResult> ReceiveWebhook()
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
            var document = JsonDocument.Parse(body);
            var payload = document.RootElement;

            // Extrai as informações de evento e do payment.id
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

            var command = new ProcessAsaasWebhookCommand
            {
                Event = eventType,
                PaymentId = paymentId
            };

            // Envia para o Handler
            var result = await Mediator.Send(command);

            return Ok(new { success = result });
        }
        catch (KeyNotFoundException)
        {
            // Retorna 200 pro Asaas parar de tentar caso seja um payload diferente do padrão
            return Ok();
        }
        catch (JsonException)
        {
            return BadRequest("JSON inválido");
        }
        catch (Exception ex)
        {
            // Registrar log
            return StatusCode(500, ex.Message);
        }
    }
}
