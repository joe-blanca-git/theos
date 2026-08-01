using MediatR;

namespace Theos.Application.SupportAccess.Queries.GetSupportUsers;

public class GetSupportUsersQuery : IRequest<List<SupportUserDto>>
{
}
