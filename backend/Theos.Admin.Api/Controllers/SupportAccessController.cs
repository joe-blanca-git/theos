using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Theos.Application.SupportAccess.Queries.GetSupportUsers;
using Theos.Application.SupportAccess.Queries.GetUserAccessDetails;
using Theos.Application.SupportAccess.Commands.GrantCourseAccess;
using Theos.Application.SupportAccess.Commands.RevokeCourseAccess;
using System.Threading.Tasks;

namespace Theos.Admin.Api.Controllers;

[Authorize(Roles = "Teacher")]
[Route("api/v1/support-access")]
[Tags("Admin - Acesso de Suporte")]
public class SupportAccessController : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var result = await Mediator.Send(new GetSupportUsersQuery());
        return Ok(result);
    }

    [HttpGet("{id}/courses")]
    public async Task<IActionResult> GetUserCourses(int id)
    {
        var result = await Mediator.Send(new GetUserAccessDetailsQuery(id));
        return Ok(result);
    }

    [HttpPost("{id}/grant/{courseId}")]
    public async Task<IActionResult> GrantAccess(int id, int courseId)
    {
        var result = await Mediator.Send(new GrantCourseAccessCommand(id, courseId));
        if (result) return Ok();
        return BadRequest("Não foi possível liberar o acesso ao curso.");
    }

    [HttpPost("{id}/revoke/{courseId}")]
    public async Task<IActionResult> RevokeAccess(int id, int courseId)
    {
        var result = await Mediator.Send(new RevokeCourseAccessCommand(id, courseId));
        if (result) return Ok();
        return BadRequest("Não foi possível remover o acesso ao curso.");
    }
}
