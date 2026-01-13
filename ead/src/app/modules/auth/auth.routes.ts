import { Routes } from '@angular/router';
import { AuthAppComponent } from './auth.app.component';
import { LoginComponent } from './pages/login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthAppComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'recovery-password',
        component: LoginComponent,
      },
      { path: 'replace-password', component: LoginComponent },
    ],
  },
];
