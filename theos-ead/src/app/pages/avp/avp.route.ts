import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { avpAppComponent } from './avp.component';
import { AvpHomeComponent } from './avp-home/avp-home.component';
import { AvpCursosComponent } from './avp-cursos/avp-cursos.component';
import { AvpCursoDetalheComponent } from './avp-curso-detalhe/avp-curso-detalhe.component';

const avpRoutingConfig: Routes = [
    {
        path: '', component: avpAppComponent,
        children: [
            {path: '', redirectTo: 'avp-home', pathMatch: 'full' },
            {path: 'avp-home', component: AvpHomeComponent}, 
            {path: 'avp-meusCursos', component: AvpCursosComponent},     
            {path: 'avp-curso-detail', component: AvpCursoDetalheComponent},       
        ]
    },
];

@NgModule({
    imports:[
        RouterModule.forChild(avpRoutingConfig)
    ],
    exports:[
        RouterModule
    ]
})

export class avpRoutingModule{}