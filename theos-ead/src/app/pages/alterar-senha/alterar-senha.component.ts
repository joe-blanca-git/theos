import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css'],
})
export class AlterarSenhaComponent implements OnInit {
  newPasswordForm: FormGroup<{
    password: FormControl<string>;
    checkPassword: FormControl<string>;
  }>;

  token: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NzNotificationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator()]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['t'] ? params['t'].replace(/ /g, '%20') : null;
      console.log('Token:', this.token);
    });
  }
  


  submitForm(): void {
    if (this.newPasswordForm.valid) {
      const { password } = this.newPasswordForm.value;
      console.log(this.token);
      console.log(password);
      
      
      this.authService.alterar(String(this.token), String(password)).subscribe(
        (Response) => {
          this.notification.success('Sucesso', Response.message);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.notification.error('Erro', 'Falha ao alterar a senha');
        }
      );
    } else {
      Object.values(this.newPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() =>
      this.newPasswordForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator(): ValidatorFn {
    return (control: AbstractControl): { [s: string]: boolean } | null => {
      if (!control.value) {
        return { required: true };
      } else if (
        control.value !== this.newPasswordForm.controls.password.value
      ) {
        return { confirm: true, error: true };
      }
      return null;
    };
  }
}
