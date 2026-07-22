using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Theos.Application.Certificates.Commands.GenerateCertificate;
using Theos.Application.Certificates.Queries.ValidateCertificate;

namespace Theos.Api.Controllers.V1;

[ApiController]
[Route("api/v1/certificates")]
public class CertificatesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CertificatesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gera um certificado para o curso informado, caso esteja 100% concluído.
    /// </summary>
    [HttpPost("generate")]
    [Authorize]
    public async Task<IActionResult> GenerateCertificate([FromBody] GenerateCertificateRequest request)
    {
        var command = new GenerateCertificateCommand { CourseId = request.CourseId };
        var validationCode = await _mediator.Send(command);

        return Ok(new { validationCode });
    }

    /// <summary>
    /// Retorna os dados do certificado validado.
    /// </summary>
    [HttpGet("validate/{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateCertificate(string code)
    {
        var query = new ValidateCertificateQuery { ValidationCode = code };
        var certificate = await _mediator.Send(query);

        return Ok(certificate);
    }

    /// <summary>
    /// Retorna os certificados do usuário logado.
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyCertificates()
    {
        var query = new Theos.Application.Certificates.Queries.GetMyCertificates.GetMyCertificatesQuery();
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}

public class GenerateCertificateRequest
{
    public int CourseId { get; set; }
}
