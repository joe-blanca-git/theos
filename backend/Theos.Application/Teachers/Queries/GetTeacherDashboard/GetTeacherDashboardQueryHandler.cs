using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Enums;

namespace Theos.Application.Teachers.Queries.GetTeacherDashboard;

public class GetTeacherDashboardQueryHandler : IRequestHandler<GetTeacherDashboardQuery, TeacherDashboardDto>
{
    private readonly ITheosDbContext _context;

    public GetTeacherDashboardQueryHandler(ITheosDbContext context)
    {
        _context = context;
    }

    public async Task<TeacherDashboardDto> Handle(GetTeacherDashboardQuery request, CancellationToken cancellationToken)
    {
        var dto = new TeacherDashboardDto();
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var nextMonthStart = currentMonthStart.AddMonths(1);
        var todayStart = now.Date;
        var todayEnd = todayStart.AddDays(1);

        // Find the teacher
        var teacher = await _context.Teachers
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.IdAgivys == request.IdAgivys && t.Active, cancellationToken);

        if (teacher == null)
            return dto;

        // Courses owned by this teacher
        var teacherCourseIdsQuery = _context.CourseTeachers
            .Where(ct => ct.TeacherId == teacher.Id)
            .Select(ct => ct.CourseId);
            
        // Purchases
        var approvedPurchases = await _context.Purchases
            .AsNoTracking()
            .Where(p => teacherCourseIdsQuery.Contains(p.CourseId) && p.Status == PurchaseStatus.Approved)
            .ToListAsync(cancellationToken);

        dto.TotalCoursesSold = approvedPurchases.Count;
        dto.TotalRevenue = approvedPurchases.Sum(p => p.Amount);
        
        // This Month vs Previous Month
        var salesCurrentMonth = approvedPurchases.Count(p => p.CreatedAt >= currentMonthStart && p.CreatedAt < nextMonthStart);
        var salesPreviousMonth = approvedPurchases.Count(p => p.CreatedAt >= previousMonthStart && p.CreatedAt < currentMonthStart);
        
        dto.SalesGrowthPercentage = salesPreviousMonth == 0 
            ? (salesCurrentMonth > 0 ? 100 : 0)
            : Math.Round((decimal)(salesCurrentMonth - salesPreviousMonth) / salesPreviousMonth * 100, 2);

        var revCurrentMonth = approvedPurchases.Where(p => p.CreatedAt >= currentMonthStart && p.CreatedAt < nextMonthStart).Sum(p => p.Amount);
        var revPreviousMonth = approvedPurchases.Where(p => p.CreatedAt >= previousMonthStart && p.CreatedAt < currentMonthStart).Sum(p => p.Amount);
        
        dto.CurrentMonthRevenue = revCurrentMonth;
        dto.RevenueGrowthPercentage = revPreviousMonth == 0 
            ? (revCurrentMonth > 0 ? 100 : 0) 
            : Math.Round((revCurrentMonth - revPreviousMonth) / revPreviousMonth * 100, 2);

        dto.TodayRevenue = approvedPurchases.Where(p => p.CreatedAt >= todayStart && p.CreatedAt < todayEnd).Sum(p => p.Amount);

        // Monthly Revenue Array
        for (int i = 1; i <= 12; i++)
        {
            var monthStart = new DateTime(now.Year, i, 1);
            var monthEnd = monthStart.AddMonths(1);
            dto.MonthlyRevenueCurrentYear[i - 1] = approvedPurchases
                .Where(p => p.CreatedAt >= monthStart && p.CreatedAt < monthEnd)
                .Sum(p => p.Amount);
        }

        // Enrollments
        var enrollments = await _context.Enrollments
            .AsNoTracking()
            .Where(e => teacherCourseIdsQuery.Contains(e.CourseId) && e.Active)
            .ToListAsync(cancellationToken);

        dto.TotalActiveStudents = enrollments.Select(e => e.UserId).Distinct().Count();
        
        dto.NewStudentsThisMonth = enrollments
            .Where(e => e.CreatedAt >= currentMonthStart && e.CreatedAt < nextMonthStart)
            .Select(e => e.UserId)
            .Distinct()
            .Count();

        // Active published courses
        dto.TotalActivePublishedCourses = await _context.Courses
            .AsNoTracking()
            .CountAsync(c => c.Active && teacherCourseIdsQuery.Contains(c.Id), cancellationToken);

        // Active classes
        dto.TotalPublishedClassesOfActiveCourses = await _context.Lessons
            .AsNoTracking()
            .CountAsync(l => l.Module.Course.Active && teacherCourseIdsQuery.Contains(l.Module.CourseId), cancellationToken);

        // Ratings
        var ratings = await _context.CourseRates
            .AsNoTracking()
            .Where(cr => teacherCourseIdsQuery.Contains(cr.CourseId))
            .ToListAsync(cancellationToken);
            
        dto.AverageCourseRating = ratings.Any() ? Math.Round((decimal)ratings.Average(r => r.Rate), 1) : 0;

        // Forums
        var teacherTopicsQuery = _context.ForumTopics
            .AsNoTracking()
            .Include(f => f.Author)
            .Include(f => f.Lesson)
                .ThenInclude(l => l.Module)
                    .ThenInclude(m => m.Course)
            .Where(f => f.LessonId != null && f.Lesson != null && teacherCourseIdsQuery.Contains(f.Lesson.Module.CourseId));

        dto.TotalOpenForumsWithoutReply = await teacherTopicsQuery
            .CountAsync(f => f.Status == ForumTopicStatus.Open && !f.Messages.Any(), cancellationToken);

        var lastForums = await teacherTopicsQuery
            .OrderByDescending(f => f.CreatedAt)
            .Take(5)
            .ToListAsync(cancellationToken);

        dto.Last5Forums = lastForums.Select(f => new DashboardForumDto
        {
            ForumId = f.CategoryId,
            TopicId = f.Id,
            CourseName = f.Lesson?.Module?.Course?.Name ?? "N/A",
            LessonName = f.Lesson?.Name ?? "N/A",
            Title = f.Title,
            AuthorName = f.Author?.FullName ?? "Desconhecido",
            Date = f.CreatedAt,
            Status = f.Status.ToString()
        }).ToList();

        return dto;
    }
}
