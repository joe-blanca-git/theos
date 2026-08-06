using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Theos.Domain.Entities;

namespace Theos.Infrastructure.Persistence.Configurations
{
    public class FinancialTaxConfiguration : IEntityTypeConfiguration<FinancialTax>
    {
        public void Configure(EntityTypeBuilder<FinancialTax> builder)
        {
            builder.ToTable("FinancialTaxes");
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Type).HasConversion<int>().IsRequired();
            builder.Property(t => t.Percentage).HasColumnType("decimal(5,4)").IsRequired(); // e.g., 0.0199 for 1.99%
            builder.Property(t => t.EffectiveFrom).IsRequired();
            builder.Property(t => t.IsActive).IsRequired();
            
            builder.Property(t => t.CreatedAt).IsRequired();
            builder.Property(t => t.UpdatedAt);
        }
    }
}
