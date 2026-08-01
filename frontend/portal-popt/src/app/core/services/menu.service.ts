import { Injectable, inject } from '@angular/core';
import { IMenuItem } from '../../features/shared/components/menu-side/menu-side.component';
import { Router } from '@angular/router';
import { AuthUtil } from '../auth/auth.util';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private authUtil = inject(AuthUtil);

  constructor(private router: Router) { }

  getMenu(): IMenuItem[] {
    const token = this.authUtil.getCookieAuth();
    let isAdmin = false;

    if (token) {
      const decoded = this.authUtil.decodeToken(token);
      if (decoded && decoded.roles && decoded.roles.includes('Admin')) {
        isAdmin = true;
      }
    }

    const menuMock = [
      {
        id: 1,
        title: 'Pagina Inicial',
        icon: 'far fa-house',
        route: '/home'
      },
      {
        id: 2,
        title: 'Cursos',
        icon: 'fas fa-book-reader',
        route: '/courses'
      },
      {
        id: 3,
        title: 'Blog',
        icon: 'fas fa-newspaper',
        route: '/blog'
      },
      {
        id: 4,
        title: 'Configurações',
        icon: 'fas fa-cog',
        route: '/settings'
      },
      {
        id: 5,
        title: 'Suporte',
        icon: 'fas fa-headset',
        route: '/support'
      }
    ];

    if (!isAdmin) {
      return menuMock.filter(m => m.route !== '/settings');
    }

    return menuMock;
  }

}
