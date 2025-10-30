import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  page: string = '';
  responseLogin: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService, 
  ) {}

  
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  submitForm(): void {

    if (this.validateForm.valid) {
      const userName = this.validateForm.get('userName')!.value;
      const password = this.validateForm.get('password')!.value;

      this.authService.login(userName, password)
      .subscribe({
        next: (v) => this.processarSucesso(v),
        error: (e) => this.processarFalha(e),
        complete: () => console.info('Login completed')
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

  processarSucesso(response: any) {
    this.authService.LocalStorage.salvarDadosLocaisUsuario(response);
  
    const userClaims = response.usuarioToken.claims;
    const roleClaim = userClaims.find((claim: any) => claim.Type === 'role');
  
    if (roleClaim?.Value === 'TEACHER') {
      this.router.navigate(['/avp']);
    } else if (roleClaim?.Value === 'STUDENT') {
      this.router.navigate(['/ava']);
    } else {
      console.error('Tipo de usuário não reconhecido:', roleClaim?.Value);
    }
  }
  

  processarFalha(fail: any) {
    if (typeof fail === 'string' && fail.includes('401') || fail.includes('403')) {
      this.createBasicNotification('bg-danger', 'text-light', 'Usuário ou Senha Incorretos!, Verifique!');
    }else if (typeof fail === 'string' && fail.includes('500')) {
      this.createBasicNotification('bg-danger', 'text-light', 'Erro no Sistema, aguarde e tente novamente mais tarde!');
    }
  }
  
  createBasicNotification(bgColor: string, textColor: string, message: string): void {
    this.notification.error(
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

}
