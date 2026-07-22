using MediatR;
using Theos.Application.PortalHome.DTOs;

namespace Theos.Application.PortalHome.Queries.GetNewsDetail;

public record GetNewsDetailQuery(int Id) : IRequest<NewsDetailDto>;
