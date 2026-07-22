using MediatR;
using Theos.Application.Certificates.DTOs;

namespace Theos.Application.Certificates.Queries.GetMyCertificates;

public class GetMyCertificatesQuery : IRequest<MyCertificatesResponseDto>
{
}
