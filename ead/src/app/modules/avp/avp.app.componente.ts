    import { CommonModule } from '@angular/common';
    import { Component } from '@angular/core';
    import { RouterModule, RouterOutlet } from '@angular/router';
    import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
    import { NzIconModule } from 'ng-zorro-antd/icon';
    import { NzLayoutModule } from 'ng-zorro-antd/layout';
    import { NzMenuModule } from 'ng-zorro-antd/menu';

    @Component({
    selector: 'avp-app-root',
    templateUrl: './avp.app.component.html',
    styleUrls: ['avp.app.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        NzBreadCrumbModule,
        NzIconModule,
        NzMenuModule,
        NzLayoutModule,
        RouterModule,
    ],
    })
    export class AvpAppComponent {
    pageTitle = 'AVP - Área Vitural do Professor';
    pageDescription = 'Gestão de Cursos destinada ao professor THEOS.';
    pageIcon = 'fa-solid fa-person-chalkboard';
    }
