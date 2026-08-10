using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Domain.Entities;
using Theos.Infrastructure.Persistence.Configurations;

namespace Theos.Infrastructure.Persistence
{
    public class TheosDbContext : DbContext, ITheosDbContext
    {
        public TheosDbContext(DbContextOptions<TheosDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<Lesson> Lessons => Set<Lesson>();
        public DbSet<Enrollment> Enrollments => Set<Enrollment>();
        public DbSet<Purchase> Purchases => Set<Purchase>();
        public DbSet<CourseDomain> CourseDomains => Set<CourseDomain>();
        public DbSet<Teacher> Teachers => Set<Teacher>();
        public DbSet<CourseTeacher> CourseTeachers => Set<CourseTeacher>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<CourseCategory> CourseCategories => Set<CourseCategory>();
        public DbSet<CourseCourseCategory> CourseCourseCategories => Set<CourseCourseCategory>();
        public DbSet<LessonView> LessonViews => Set<LessonView>();
        public DbSet<ForumCategory> ForumCategories => Set<ForumCategory>();
        public DbSet<ForumTopic> ForumTopics => Set<ForumTopic>();
        public DbSet<ForumMessage> ForumMessages => Set<ForumMessage>();
        public DbSet<CourseRate> CourseRates => Set<CourseRate>();
        public DbSet<Certificate> Certificates => Set<Certificate>();
        public DbSet<AppRole> AppRoles => Set<AppRole>();
        public DbSet<AppUserRole> AppUserRoles => Set<AppUserRole>();
        public DbSet<TicketCategory> TicketCategories => Set<TicketCategory>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<TicketMessage> TicketMessages => Set<TicketMessage>();
        public DbSet<TicketAttachment> TicketAttachments => Set<TicketAttachment>();
        public DbSet<TicketTimeline> TicketTimelines => Set<TicketTimeline>();
        public DbSet<FinancialTax> FinancialTaxes => Set<FinancialTax>();
        public DbSet<FinancialClosing> FinancialClosings => Set<FinancialClosing>();
        public DbSet<FinancialClosingItem> FinancialClosingItems => Set<FinancialClosingItem>();
        public DbSet<RefundRequest> RefundRequests => Set<RefundRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(TheosDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}

