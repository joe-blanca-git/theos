using MediatR;
using System.Collections.Generic;

namespace Theos.Application.Portal.Courses.Queries.GetMyCourses;

public record GetMyCoursesQuery() : IRequest<List<PortalMyCourseDto>>;
