import { Routes } from '@angular/router';
import { AvpAppComponent } from './avp.app.componente';
import { HomeComponent } from './pages/home/home.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';

export const AVP_ROUTES: Routes = [
  {
    path: '',
    component: AvpAppComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'course-detail',
        component: CourseDetailComponent,
      },
    ],
  },
];