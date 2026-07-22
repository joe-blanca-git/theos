using MediatR;

namespace Theos.Application.Purchases.Commands.RefundCourse;

public record RefundCourseCommand(int PurchaseId) : IRequest<RefundCourseResponseDto>;
