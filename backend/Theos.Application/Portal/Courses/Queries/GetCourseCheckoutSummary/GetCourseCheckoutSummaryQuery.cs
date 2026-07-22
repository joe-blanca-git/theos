using MediatR;

namespace Theos.Application.Portal.Courses.Queries.GetCourseCheckoutSummary;

public record GetCourseCheckoutSummaryQuery(int CourseId) : IRequest<PortalCourseCheckoutSummaryDto?>;
