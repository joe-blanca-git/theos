import { Component, Input } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer'; 
import { NzButtonModule } from 'ng-zorro-antd/button'; 


export interface Menu {
  name: string;
  route: string;
}
@Component({
  selector: 'landing-page-app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzDrawerModule,
    NzButtonModule,
    RouterModule,
  ],
  templateUrl: './landing-page.app-component.html',
  styleUrls: ['landing-page.app.component.scss'],
})
export class LandingPageAppComponent {

  isMobileMenuOpen = false;
  menu: Menu[] = [
    { name: 'Inicio', route: '/landing/home' },
    { name: 'Sobre nós', route: '/landing/about-us' },
    { name: 'Entrar', route: '/auth/login' },
  ];

openMobileMenu(): void {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}

