using MediatR;
using Microsoft.EntityFrameworkCore;
using Theos.Application.Common.Interfaces;
using Theos.Application.Common.Models.Bunny;
using Theos.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Theos.Application.Webhooks.Commands.ProcessBunnyWebhook
{
    public record ProcessBunnyWebhookCommand : IRequest<bool>
    {
        public BunnyWebhookPayload Payload { get; init; } = null!;
    }

    public class ProcessBunnyWebhookCommandHandler : IRequestHandler<ProcessBunnyWebhookCommand, bool>
    {
        private readonly ITheosDbContext _context;
        private readonly IBunnyVideoService _bunnyVideoService;

        public ProcessBunnyWebhookCommandHandler(ITheosDbContext context, IBunnyVideoService bunnyVideoService)
        {
            _context = context;
            _bunnyVideoService = bunnyVideoService;
        }

        public async Task<bool> Handle(ProcessBunnyWebhookCommand request, CancellationToken cancellationToken)
        {
            var payload = request.Payload;
            
            var lesson = await _context.Lessons
                .FirstOrDefaultAsync(l => l.BunnyVideoId == payload.VideoGuid, cancellationToken);

            if (lesson == null)
            {
                // Webhook can be triggered for videos not managed by this system, or already deleted.
                return false; 
            }

            // Status 3 in Bunny Stream means Finished/Ready. Status 4 means Failed.
            if (payload.Status == 3)
            {
                lesson.Status = LessonStatus.Ready;
                lesson.ProcessedAt = DateTime.UtcNow;

                // Optionally, fetch more metadata from Bunny if needed
                try
                {
                    var videoInfo = await _bunnyVideoService.GetVideoAsync(payload.VideoLibraryId, payload.VideoGuid, cancellationToken);
                    lesson.DurationSeconds = videoInfo.Length;
                    
                    // Thumbnail is generally predictable in Bunny
                    lesson.Thumbnail = $"https://video.bunnycdn.com/library/{payload.VideoLibraryId}/videos/{payload.VideoGuid}/thumbnail.jpg";
                }
                catch
                {
                    // If fetching fails, we still mark it as Ready but might miss duration.
                }
            }
            else if (payload.Status == 4 || payload.Status == 5)
            {
                // 4 = Failed, 5 = PresignedUploadFailed
                lesson.Status = LessonStatus.Failed;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
