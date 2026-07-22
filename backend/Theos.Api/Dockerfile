# Etapa 1: Usar o SDK do .NET 8 para compilar o código
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar os arquivos de projeto (.csproj) para restaurar as dependências primeiro
COPY ["Theos.Api/Theos.Api.csproj", "Theos.Api/"]
COPY ["Theos.Application/Theos.Application.csproj", "Theos.Application/"]
COPY ["Theos.Domain/Theos.Domain.csproj", "Theos.Domain/"]
COPY ["Theos.Infrastructure/Theos.Infrastructure.csproj", "Theos.Infrastructure/"]
RUN dotnet restore "Theos.Api/Theos.Api.csproj"

# Copiar o resto do código e compilar a aplicação
COPY . .
WORKDIR "/src/Theos.Api"
RUN dotnet build "Theos.Api.csproj" -c Release -o /app/build

# Publicar a versão otimizada
FROM build AS publish
RUN dotnet publish "Theos.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Criar a imagem final super leve apenas com o ASP.NET (sem o SDK de compilação)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Definir a porta padrão e o comando de inicialização
EXPOSE 8080
ENTRYPOINT ["dotnet", "Theos.Api.dll"]
