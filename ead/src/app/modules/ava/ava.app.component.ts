import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { filter } from 'rxjs/operators';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
export interface Menu {
  name: string;
  route: string;
}

@Component({
  selector: 'app-ava.app',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzDrawerModule,
    NzButtonModule,
    UserPanelComponent,
  ],
  templateUrl: './ava.app.component.html',
  styleUrl: './ava.app.component.scss',
})
export class AvaAppComponent implements OnInit {
  routeBase = '';
  routeModule = '';
  routeApp = '';

  menu: Menu[] = [
    { name: 'Inicio', route: '/avat/home' },
    { name: 'Meus Cursos', route: '/avat/my-courses' },
    { name: 'Certificados', route: '/avat/certifieds' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setRoutes(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setRoutes(event.urlAfterRedirects);
      });
  }

  menuVisible = false;

  openMenu(): void {
    this.menuVisible = true;
  }

  closeMenu(): void {
    this.menuVisible = false;
  }

  private setRoutes(url: string): void {
    const segments = url.split('?')[0].split('/').filter(Boolean);

    this.routeBase = segments[0] ?? '';
    this.routeModule = segments[1] ?? '';
    this.routeApp = segments[2] ?? '';
  }
}
