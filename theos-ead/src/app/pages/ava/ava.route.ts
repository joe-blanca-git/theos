import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AvaAppComponent } from './ava.component';
import { AvaCursoViewComponent } from './ava-curso-view/ava-curso-view.component';
import { AvaCursoDetalheComponent } from './ava-curso-detalhe/ava-curso-detalhe.component';
import { AvaHomeComponent } from './ava-home/ava-home.component';
import { AvaCursandoComponent } from './ava-cursando/ava-cursando.component';
import { AvaCursosComponent } from './ava-cursos/ava-cursos.component';
import { AvaProfileComponent } from './ava-profile/ava-profile.component';
import { AvaCertifiedComponent } from './ava-certified/ava-certified.component';
import { AvaSuportComponent } from './ava-suport/ava-suport.component';
import { AvaBuyComponent } from './ava-buy/ava-buy.component';

const AvaRoutingConfig: Routes = [
    {
        path: '', component: AvaAppComponent,
        children: [
            {path: '', redirectTo: 'ava-home', pathMatch: 'full' },
            {path: 'ava-home', component: AvaHomeComponent},
            {path: 'ava-cursos', component: AvaCursosComponent},
            {path: 'ava-cursando', component: AvaCursandoComponent},
            {path: 'ava-curso-detalhe', component: AvaCursoDetalheComponent},
            {path: 'ava-curso-view', component: AvaCursoViewComponent},
            {path: 'ava-aula', component: AvaCursoViewComponent},
            {path: 'ava-profile', component: AvaProfileComponent},
            {path: 'ava-certified', component: AvaCertifiedComponent},
            {path: 'ava-suport', component: AvaSuportComponent},
            {path: 'ava-buy', component: AvaBuyComponent},
        ]
    },
];

@NgModule({
    imports:[
        RouterModule.forChild(AvaRoutingConfig)
    ],
    exports:[
        RouterModule
    ]
})

export class AvaRoutingModule{}