import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LandingCursosComponent } from './pages/landing/landing-cursos/landing-cursos.component';
import { LandingProfessoresComponent } from './pages/landing/landing-professores/landing-professores.component';
import { LandingSobreComponent } from './pages/landing/landing-sobre/landing-sobre.component';
import { LandingTodosComponent } from './pages/landing/landing-todos/landing-todos.component';
import { TermosComponent } from './pages/termos/termos.component';
import { PoliticaComponent } from './pages/politica/politica.component';
import { LandingCursoDetalheComponent } from './pages/landing/landing-curso-detalhe/landing-curso-detalhe.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AuthService } from './shared/services/auth.service';
import { httpClient } from 'src/core/httpClient';
import { BaseService } from './shared/services/base.service';
import { Cloudinary } from '@cloudinary/url-gen';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { PainelAdmComponent } from './pages/painel-adm/painel-adm.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { avaService } from './pages/ava/services/ava.service';
import { landingService } from './pages/landing/services/landing.service';
import { buyService } from './pages/ava/ava-buy/services/ava.buy.service';
import { AlterarSenhaComponent } from './pages/alterar-senha/alterar-senha.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { avpService } from './pages/avp/services/avp.service';
import { NotificationService } from './shared/services/notification.service';


registerLocaleData(pt);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    LandingCursosComponent,
    LandingProfessoresComponent,
    LandingSobreComponent,
    LandingTodosComponent,
    TermosComponent,
    PoliticaComponent,
    LandingCursoDetalheComponent,
    RegistrarComponent,
    PainelAdmComponent,
    RecuperarSenhaComponent,
    AlterarSenhaComponent,
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    CommonModule,
    NzCheckboxModule,
    NzSelectModule,
    NzResultModule,
    NzCarouselModule
    
  ],
  providers: [
    AuthService,
    avaService,
    avpService,
    buyService,
    landingService,
    httpClient,
    BaseService,
    NotificationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: NZ_I18N, useValue: pt_BR }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
