import { Routes } from '@angular/router';
import { AvaAppComponent } from './ava.app.component';
import { AvaHomeComponent } from './pages/ava-home/ava-home.component';
import { AvaCourseDetailComponent } from './pages/ava-course-detail/ava-course-detail.component';

export const AVA_ROUTES: Routes = [
  {
    path: '',
    component: AvaAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: AvaHomeComponent,
      },
      {
        path: 'course-detail',
        component: AvaCourseDetailComponent,
      },
    ],
  },
];
