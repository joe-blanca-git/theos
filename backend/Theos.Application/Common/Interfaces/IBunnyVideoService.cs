using System.Threading;
using System.Threading.Tasks;
using Theos.Application.Common.Models.Bunny;

namespace Theos.Application.Common.Interfaces
{
    public interface IBunnyVideoService
    {
        Task<VideoResponseDto> CreateVideoAsync(int libraryId, string collectionId, string title, CancellationToken cancellationToken);
        Task<VideoUploadInformationDto> GenerateUploadInformationAsync(int libraryId, string bunnyVideoId, CancellationToken cancellationToken);
        Task<VideoResponseDto> GetVideoAsync(int libraryId, string bunnyVideoId, CancellationToken cancellationToken);
        Task<int> GetVideoStatusAsync(int libraryId, string bunnyVideoId, CancellationToken cancellationToken);
        Task<bool> DeleteVideoAsync(int libraryId, string bunnyVideoId, CancellationToken cancellationToken);
    }
}
