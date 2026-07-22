using FluentValidation;

namespace Theos.Application.Courses.Commands.DeleteModule
{
    public class DeleteModuleCommandValidator : AbstractValidator<DeleteModuleCommand>
    {
        public DeleteModuleCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("ID do módulo deve ser maior que 0.");
        }
    }
}
