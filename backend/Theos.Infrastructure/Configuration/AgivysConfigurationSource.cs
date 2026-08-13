using Microsoft.Extensions.Configuration;

namespace Theos.Infrastructure.Configuration;

public class AgivysConfigurationSource : IConfigurationSource
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string LoginUrl { get; set; } = "https://joederblanca.com.br/agivys-api/api/v1/authentication/login";
    public string IntegrationsUrl { get; set; } = "https://joederblanca.com.br/agivys-api/api/v1/integration";

    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new AgivysConfigurationProvider(this);
    }
}
