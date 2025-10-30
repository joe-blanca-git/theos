import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LandingCursosComponent } from './pages/landing/landing-cursos/landing-cursos.component';
import { LandingProfessoresComponent } from './pages/landing/landing-professores/landing-professores.component';
import { LandingSobreComponent } from './pages/landing/landing-sobre/landing-sobre.component';
import { LandingTodosComponent } from './pages/landing/landing-todos/landing-todos.component';
import { LandingCursoDetalheComponent } from './pages/landing/landing-curso-detalhe/landing-curso-detalhe.component';
import { TermosComponent } from './pages/termos/termos.component';
import { PoliticaComponent } from './pages/politica/politica.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { AlterarSenhaComponent } from './pages/alterar-senha/alterar-senha.component';

const avaRoutingConfig: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: LandingPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registrar', component: RegistrarComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent},
  {path: 'alterar-senha', component: AlterarSenhaComponent},
  {path: 'cursos', component: LandingCursosComponent},
  {path: 'curso-detalhe', component: LandingCursoDetalheComponent},
  {path: 'sobre', component: LandingSobreComponent},
  {path: 'todos', component: LandingTodosComponent},
  {path: 'termos', component: TermosComponent},
  {path: 'politica', component: PoliticaComponent},
  {path: 'professores', component: LandingProfessoresComponent},
  {path: 'ava',
    loadChildren: ()=> import('./pages/ava/ava.module')
  .then(m => m.AvaModule)},
  {path: 'avp',
    loadChildren: ()=> import('./pages/avp/avp.module')
  .then(m => m.AvpModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(avaRoutingConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }