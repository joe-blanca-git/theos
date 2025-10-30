import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NzResultStatusType } from 'ng-zorro-antd/result';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    username: FormControl<string>;
    phoneNumber: FormControl<string>;
    agree: FormControl<boolean>;
  }>;

  messageTitle:string = '';
  messageContent:string = '';
  messageStatus: NzResultStatusType = 'success';
  showMessage:boolean = true;

  constructor(
    private fb: NonNullableFormBuilder, 
    private notification: NzNotificationService, 
    private authService: AuthService,
    private router: Router) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      username: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]]
    });

  }

  createBasicNotification(bgColor: string, textColor: string, message: string): void {
    this.notification.success(
      '',
      message,
      {
        nzClass: [bgColor, textColor],
        nzDuration: 7000,
        nzPlacement:'bottom'
      },
      
    ).onClick.subscribe(() => {
      console.log('');
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const email = this.validateForm.get('email')!.value;
      const password = this.validateForm.get('password')!.value;
      const username = this.validateForm.get('username')!.value;
      const contato = this.validateForm.get('phoneNumber')!.value;

      this.authService.registrar(email, password, username, contato)
        .subscribe({
          next: (v) => this.processarSucesso(v),
          error: (e) => this.processarFalha(e),
          complete: () => console.info('Registration Complete')
        });

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  processarSucesso(response: any){
    this.createBasicNotification('bg-success', 'text-light', 'Cadastro realizado com Sucesso, você já pode acessar!');
    this.router.navigate(['/login']);
  }

  processarFalha(fail: any) {
    if (fail.status === 500) {
      this.createBasicNotification('bg-danger', 'text-light', 'Erro no Sistema, aguarde e tente novamente mais tarde!');
    }else if (fail.status === 409) {
      this.createBasicNotification('bg-danger', 'text-light', 'Usuário ou E-mail já cadastrados! Tente outro');
    };

  }
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



}
