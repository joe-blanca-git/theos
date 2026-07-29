using Microsoft.AspNetCore.Mvc;
using Theos.Application.Teachers.Commands.CreateTeacher;
using Theos.Application.Teachers.Commands.UpdateTeacher;
using Theos.Application.Teachers.Commands.DeleteTeacher;
using Theos.Application.Teachers.Commands.AssignTeacher;
using Theos.Application.Teachers.Queries.GetTeachers;
using Theos.Application.Teachers.Queries.GetTeacherById;
using Theos.Application.Teachers.Common;

namespace Theos.Admin.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TeachersController : ApiControllerBase
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

    /// <summary>
    /// Cadastra um novo professor.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<int>> CreateTeacher(CreateTeacherCommand command)
    {
        var id = await Mediator.Send(command);
        return CreatedAtAction(nameof(GetTeacherById), new { id }, id);
    }

    /// <summary>
    /// Atualiza os dados de um professor existente.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTeacher(int id, UpdateTeacherCommand command)
    {
        if (id != command.Id) return BadRequest("ID na rota não confere com ID no corpo da requisição.");

        var success = await Mediator.Send(command);
        if (!success) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Remove (inativa) um professor.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTeacher(int id)
    {
        var success = await Mediator.Send(new DeleteTeacherCommand { Id = id });
        if (!success) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Vincula um professor a um curso específico.
    /// </summary>
    [HttpPost("assign")]
    public async Task<ActionResult> AssignTeacher(AssignTeacherCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success) return BadRequest(result.Message);

        return Ok(new { message = result.Message });
    }

    /// <summary>
    /// Desvincula um professor de um curso específico.
    /// </summary>
    [HttpPost("unassign")]
    public async Task<ActionResult> UnassignTeacher(Theos.Application.Teachers.Commands.UnassignTeacher.UnassignTeacherCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success) return BadRequest(result.Message);

        return Ok(new { message = result.Message });
    }
}
