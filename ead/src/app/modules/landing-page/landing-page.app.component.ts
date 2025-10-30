import { Component, Input } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from "@angular/common";
export interface Menu {
  name: string, 
  route: string,
  active: boolean
}
@Component({
    selector: 'landing-page-app-root',
    templateUrl: './landing-page.app-component.html',
    styleUrls: ['landing-page.app.component.scss',],
    standalone: true,
    imports: [CommonModule, RouterOutlet, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, RouterModule]
})
export class LandingPageAppComponent {
  @Input('activeRoute') activeRoute: boolean = false;

  menu: Menu[] = [
    {
      name: 'Inicio',
      route: '/landing/home',
      active: false,
    },
    {
      name: 'Sobre nós',
      route: '/landing/about-us',
      active: false,
    },
    // {
    //   name: 'Objetivos',
    //   route: '/landing/targets',
    //   active: false,
    // },
    {
      name: 'Professores',
      route: '/landing/teachers',
      active: false,
    },
    {
      name: 'Planos',
      route: '/landing/plans',
      active: false,
    },
    {
      name: 'Cursos',
      route: '/landing/courses',
      active: false,
    },
    {
      name: 'Entrar',
      route: '/auth/menu-auth',
      active: false,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const rotaAtual = this.router.url;

    this.menu.forEach((e: any) => {
      if (e.route === rotaAtual) {
        e.active = true;
      }
    });
  }
}