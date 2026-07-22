using MediatR;
using Theos.Application.PortalHome.DTOs;

namespace Theos.Application.PortalHome.Queries.GetHome;

public record GetHomeQuery : IRequest<PortalHomeDto>;
