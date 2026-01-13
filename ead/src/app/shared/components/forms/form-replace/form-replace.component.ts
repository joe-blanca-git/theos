import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-replace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-replace.component.html',
  styleUrl: './form-replace.component.scss',
})
export class FormReplaceComponent {
  form: FormGroup;
  token: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {
    this.form = this.fb.group(
      {
        password: [null, [Validators.required, this.strongPasswordValidator()]],
        passwordConfirm: [null, Validators.required],
      },
      { validators: this.matchPasswordValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['t'];

    if (!this.token) {
      this.notification.error(
        'Erro',
        'Link inválido. Por favor, solicite a recuperação novamente.'
      );
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.form.valid && this.token) {
      this.isLoading = true;
      const newPassword = this.form.get('password')?.value;

      this.authService
        .completePasswordReset(this.token, newPassword)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.notification.success('Sucesso', 'Sua senha foi alterada!');
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.isLoading = false;
            this.notification.error(
              'Erro',
              'O link expirou ou é inválido. Solicite novamente.'
            );
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      return hasUpperCase && hasNumeric && hasSymbol
        ? null
        : { weakPassword: true };
    };
  }

  matchPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('passwordConfirm');
    if (!password || !confirm) return null;

    if (password.value !== confirm.value) {
      confirm.setErrors({ ...confirm.errors, mismatch: true });
      return { mismatch: true };
    }
    return null;
  };
}
