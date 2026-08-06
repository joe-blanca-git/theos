using MediatR;

namespace Theos.Application.Teachers.Queries.GetTeacherDashboard;

public class GetTeacherDashboardQuery : IRequest<TeacherDashboardDto>
{
    public string IdAgivys { get; set; } = string.Empty;
}
