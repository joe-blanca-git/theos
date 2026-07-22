using Microsoft.AspNetCore.Mvc;
using Theos.Application.Teachers.Queries.GetTeachers;
using Theos.Application.Teachers.Queries.GetTeacherById;
using Theos.Application.Teachers.Common;
using Microsoft.AspNetCore.Authorization;

namespace Theos.Landing.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("v1/api/Teachers")]
public class LandingTeachersController : ApiControllerBase
{
    /// <summary>
    /// Lista todos os professores ativos.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<TeacherDto>>> GetTeachers()
    {
        return await Mediator.Send(new GetTeachersQuery());
    }

    /// <summary>
    /// Obtém detalhes de um professor pelo ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherDto>> GetTeacherById(int id)
    {
        var teacher = await Mediator.Send(new GetTeacherByIdQuery { Id = id });
        if (teacher == null) return NotFound();
        return teacher;
    }
}
