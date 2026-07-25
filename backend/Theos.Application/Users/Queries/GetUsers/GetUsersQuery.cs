using MediatR;
using System.Collections.Generic;

namespace Theos.Application.Users.Queries.GetUsers;

public class GetUsersQuery : IRequest<List<UserDto>>
{
}
