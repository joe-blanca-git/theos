namespace Theos.Application.PortalHome.DTOs;

public record LatestCourseDto(
    int Id,
    string Title,
    string? Description,
    string? HeaderImageUrl,
    decimal Rating,
    int VoteCount,
    List<Theos.Application.Courses.Common.CourseCategoryBasicDto>? Categories = null
);
