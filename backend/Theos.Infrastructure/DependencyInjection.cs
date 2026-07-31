using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Theos.Application.Common.Interfaces;
using Theos.Infrastructure.Persistence;
using Theos.Infrastructure.ExternalServices.Asaas;
using Theos.Infrastructure.Services;
using Theos.Infrastructure.Jobs;

namespace Theos.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));

            services.AddDbContext<TheosDbContext>(options =>
                options.UseMySql(connectionString, serverVersion,
                b => b.MigrationsAssembly(typeof(TheosDbContext).Assembly.FullName)));

            services.AddScoped<ITheosDbContext>(provider => provider.GetRequiredService<TheosDbContext>());

            services.AddHttpClient<IAsaasService, AsaasService>(client =>
            {
                var baseUrl = configuration["Asaas:BaseUrl"] ?? "https://sandbox.asaas.com/api/v3/";
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.UserAgent.ParseAdd("Theos.Backend/1.0");
            });
            services.AddScoped<ICloudflareStorageService, CloudflareStorageService>();
            
            // Dummy Helpdesk services (Para rodar o Migration e inicializar a API sem Cloudflare/Resend ainda)
            services.AddScoped<IEmailService, DummyEmailService>();
            services.AddScoped<IFileStorageService, DummyFileStorageService>();
            
            services.AddHttpClient<IBunnyNetService, BunnyNetService>(client =>
            {
                client.BaseAddress = new Uri("https://api.bunny.net/");
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            });

            services.AddHttpClient<IBunnyVideoService, BunnyVideoService>(client =>
            {
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            });

            // services.AddHostedService<OrphanVideoCleanupBackgroundService>();
                                
            return services;
        }
    }
}
