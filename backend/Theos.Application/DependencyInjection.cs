using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Theos.Application.Common.Behaviors;
using Theos.Application.Common.Interfaces;
using Theos.Application.Common.Services;
using System.Reflection;

namespace Theos.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();

            services.AddMediatR(cfg => {
                cfg.RegisterServicesFromAssembly(assembly);
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            });

            services.AddValidatorsFromAssembly(assembly);

            services.AddScoped<IUserContextService, UserContextService>();

            return services;
        }
    }
}
