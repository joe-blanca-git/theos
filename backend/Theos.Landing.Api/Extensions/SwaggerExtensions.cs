using Microsoft.OpenApi.Models;
using Theos.Landing.Api.Filters;

namespace Theos.Landing.Api.Extensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddSwaggerSetup(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                c.DocumentFilter<SwaggerOrderingFilter>();
                c.OperationFilter<SwaggerExamplesOperationFilter>();
                c.SwaggerDoc("v1", new OpenApiInfo 
                { 
                    Title = "Theos Landing API", 
                    Version = "v1",
                    Description = "API do sistema Theos para gerenciamento de cursos e alunos.",
                    Contact = new OpenApiContact
                    {
                        Name = "Theos Support",
                        Email = "suporte@theos.com.br"
                    }
                });

                var apiXmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var apiXmlPath = Path.Combine(AppContext.BaseDirectory, apiXmlFile);
                c.IncludeXmlComments(apiXmlPath);

                var appXmlFile = "Theos.Application.xml";
                var appXmlPath = Path.Combine(AppContext.BaseDirectory, appXmlFile);
                if (File.Exists(appXmlPath))
                {
                    c.IncludeXmlComments(appXmlPath);
                }

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            return services;
        }
    }
}
