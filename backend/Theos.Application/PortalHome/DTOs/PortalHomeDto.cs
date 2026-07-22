namespace Theos.Application.PortalHome.DTOs;

public record PortalHomeDto(
    LatestCourseDto? LatestCourse,
    List<LatestNewsDto> LatestNews,
    MyLatestLessonDto? MyLatestLesson,
    MyCoursesSummaryDto MyCoursesSummary
);
