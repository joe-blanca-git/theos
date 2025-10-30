import { Component, } from '@angular/core';
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
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent {

  validateForm: FormGroup<{
    email: FormControl<string>;
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
    });

  }


  submitForm(): void {
    if (this.validateForm.valid) {      
      const email = this.validateForm.get('email')!.value;

      this.authService.recuperar(email)
        .subscribe({
          next: (v) => this.processarSucesso(v),
          error: (e) => this.processarFalha(e),
          complete: () => console.info('Recovery Complete')
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

  public sendEmail(token:string, userEmail: string) {
    //const message = 'https://institutotheos.com.br/#/alterar-senha?t=';
    const message = 'http://192.168.0.217:4200/#/alterar-senha?t=';
    const templateParams = {
      user_email: userEmail, 
      message: message + token    
    };

    emailjs
      .send(
        'service_9414d4g',    
        'template_544jmaj',   
        templateParams,      
        'OyRVwYNe3WqFpIPEw'   
      )
      .then(
        () => {
          this.createBasicNotification('bg-success', 'text-light', 'E-mail enviado com sucesso! Verifique sua caixa de email!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        }
      );
  }

  processarSucesso(response: any){
    this.sendEmail(response.request_token, response.email)
  }

  processarFalha(fail: any) {
    if (fail.status === 500) {
      this.createBasicNotification('bg-danger', 'text-light', 'Erro no Sistema, aguarde e tente novamente mais tarde!');
    }else if (fail.status === 409) {
      this.createBasicNotification('bg-danger', 'text-light', 'Usuário ou E-mail já cadastrados! Tente outro');
    };

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

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.email.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
