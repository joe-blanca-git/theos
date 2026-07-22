using MediatR;

namespace Theos.Application.Portal.Courses.Queries.GetCourseDetail;

public record GetCourseDetailQuery(int CourseId) : IRequest<GetCourseDetailResponseDto?>;
