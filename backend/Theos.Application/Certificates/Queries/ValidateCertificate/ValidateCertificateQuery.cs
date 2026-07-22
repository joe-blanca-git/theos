using MediatR;

namespace Theos.Application.Certificates.Queries.ValidateCertificate;

public class ValidateCertificateQuery : IRequest<CertificateDetailDto>
{
    public string ValidationCode { get; set; } = string.Empty;
}
