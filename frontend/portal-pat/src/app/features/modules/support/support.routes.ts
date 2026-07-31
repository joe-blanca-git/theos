import { Routes } from '@angular/router';
import { SupportHomeComponent } from './pages/support-home/support-home.component';
import { SupportTicketsComponent } from './pages/support-tickets/support-tickets.component';

export const supportRoutes: Routes = [
    {
        path: '',
        component: SupportHomeComponent,
        title: 'Suporte & FAQ'
    },
    {
        path: 'tickets',
        component: SupportTicketsComponent,
        title: 'Meus Chamados'
    }
];
