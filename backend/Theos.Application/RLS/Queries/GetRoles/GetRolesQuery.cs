using MediatR;
using System.Collections.Generic;

namespace Theos.Application.RLS.Queries.GetRoles;

public class GetRolesQuery : IRequest<List<RoleDto>>
{
}
