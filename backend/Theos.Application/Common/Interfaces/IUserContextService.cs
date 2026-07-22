using Theos.Domain.Entities;

namespace Theos.Application.Common.Interfaces
{
    public interface IUserContextService
    {
        Task<User> GetCurrentUserAsync();
    }
}
