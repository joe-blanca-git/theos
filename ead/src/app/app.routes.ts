import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'landing',
        loadChildren: () => import('../app/modules/landing-page/landing-page.routes').then((r) => r.LANDINGPAGE_ROUTES)
    },
     {
        path:'auth',
        loadChildren: () => import('../app/modules/auth/auth.routes').then((r) => r.AUTH_ROUTES)
    },
     {
        path:'avp',
        loadChildren: () => import('../app/modules/avp/avp.routes').then((r) => r.AVP_ROUTES)
    },
      {
        path: '**',
        redirectTo: 'landing/home',
    },
    
];
