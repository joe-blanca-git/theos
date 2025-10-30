import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
})
export class FormLoginComponent {
  responseLogin: any;
  loginForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authService.login(username, password).subscribe({
        next: (v) => this.processSuccess(v),
        error: (e) => this.processFail(e),
        complete: () => console.info('Login completed'),
      });
    } else {
    }
  }

  processSuccess(response: any) {
    this.authService.localStorageUtils.salvarDadosLocaisUsuario(response);

    const userClaims = response.usuarioToken.claims;
    const roleClaim = userClaims.find((claim: any) => claim.Name === 'user_type');

    console.log(roleClaim);
    

    if (roleClaim?.Value === 'TEACHER' || roleClaim?.Value === 'ADMIN') {
      this.router.navigate(['/avp']);
    } else if (roleClaim?.Value === 'STUDENT') {
      this.router.navigate(['/ava']);
    } else {
      console.error('Tipo de usuário não reconhecido:', roleClaim?.Value);
    }

    
  }

  processFail(fail: any) {
    if (
      (typeof fail === 'string' && fail.includes('401')) ||
      fail.includes('403')
    ) {
      this.notification.error(
        'Erro',
        'Usuário ou Senha Incorretos!, Verifique!',
        {
          nzClass: 'custom-notification-error',
          nzDuration: 5000,
          nzStyle: {
            'background-color': '#5c0011',
            color: '#ffffffff',
          },
        }
      );
    } else if (typeof fail === 'string' && fail.includes('500')) {
      this.notification.error(
        'Erro',
        'Erro no Sistema, aguarde e tente novamente mais tarde!'
      );
    }
  }
}
