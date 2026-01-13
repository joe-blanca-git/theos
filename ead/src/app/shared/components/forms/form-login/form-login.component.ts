import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LocalStorageUtils } from '../../../utils/localstorage';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
})
export class FormLoginComponent {
  responseLogin: any;
  loginForm: FormGroup;
  loading = false;

  localStorageUtils = new LocalStorageUtils();

  constructor(
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

  ngOnInit(): void {
    this.verifyLogin();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const username = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authService.login(username, password).subscribe({
        next: (v) => this.processSuccess(v),
        error: (e) => this.processFail(e),
        complete: () => (this.loading = false),
      });
    } else {
    }
  }

  processSuccess(response: any) {
    this.authService.localStorageUtils.salvarDadosLocaisUsuario(response);

    const userRole = response.user.roles;
    const role = userRole.find((role: any) => role.Name === 'user_type');

    if (role?.Value === 'TEACHER' || role?.Value === 'ADMIN') {
      this.router.navigate(['/avp']);
    } else if (role?.Value === 'STUDENT') {
      this.router.navigate(['/avat']);
    } else {
      console.error('Tipo de usuário não reconhecido:', role?.Value);
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
        }
      );
    } else if (typeof fail === 'string' && fail.includes('500')) {
      this.notification.error(
        'Erro',
        'Erro no Sistema, aguarde e tente novamente mais tarde!'
      );
    }

    this.loading = false;
  }

  verifyLogin() {
    const validToken = this.localStorageUtils.verifyToken();

    if (validToken) {
      const userType = this.localStorageUtils.obterTipoDeUsuario();

      if (userType === 'TEACHER' || userType === 'ADMIN') {
        this.router.navigate(['/avp']);
      } else if (userType === 'STUDENT') {
        this.router.navigate(['/avat']);
      } else {
        console.error('Tipo de usuário não reconhecido:', userType);
      }
    } else {
      this.localStorageUtils.limparDadosLocaisUsuario();
    }
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
