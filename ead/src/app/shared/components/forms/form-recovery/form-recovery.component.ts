import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AuthService,
  UserRecoveryRequest,
} from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-recovery',
  standalone: true,
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-recovery.component.html',
  styleUrl: './form-recovery.component.scss',
})
export class FormRecoveryComponent {
  recoveryForm: FormGroup;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  onRecovery() {
    if (this.recoveryForm.valid) {
      this.loading = true;

      const body: UserRecoveryRequest = {
        email: this.recoveryForm.controls['email'].value,
      };

      this.authService.recovery(body).subscribe({
        next: (response) => {
          this.notification.show('success', 'Sucesso', response.message, 10000);
          this.router.navigate(['/auth/login']);
        },
        error: (fail) => {
          console.error('Error ao tentar recuperar senha:', fail);
        },
         complete: () => (this.loading = false)
      });
    }else {
      this.recoveryForm.markAllAsTouched();
      this.recoveryForm.markAsDirty();
    }
  }
}
