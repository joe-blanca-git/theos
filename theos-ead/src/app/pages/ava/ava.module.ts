import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvaRoutingModule } from './ava.route';
import { AvaAppComponent } from './ava.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoginComponent } from '../login/login.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AvaCursoDetalheComponent } from './ava-curso-detalhe/ava-curso-detalhe.component';
import { AvaCursoViewComponent } from './ava-curso-view/ava-curso-view.component';
import { AvaHomeComponent } from './ava-home/ava-home.component';
import { AvaCursandoComponent } from './ava-cursando/ava-cursando.component';
import { AvaCursosComponent } from './ava-cursos/ava-cursos.component';
import { AvaProfileComponent } from './ava-profile/ava-profile.component';
import { AvaCertifiedComponent } from './ava-certified/ava-certified.component';
import { AvaSuportComponent } from './ava-suport/ava-suport.component';
import { AvaBuyComponent } from './ava-buy/ava-buy.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { AvaAvaliaComponent } from './ava-curso-view/components/ava-avalia/ava-avalia.component';
import { CartComponent } from './ava-buy/cart/cart/cart.component';



@NgModule({
    declarations: [
        AvaAppComponent,
        AvaCursoDetalheComponent,
        AvaCursoViewComponent,
        AvaHomeComponent,
        AvaCursandoComponent,
        AvaCursosComponent,
        AvaProfileComponent,
        AvaCertifiedComponent,
        AvaSuportComponent,
        AvaBuyComponent,
        AvaAvaliaComponent,
        CartComponent
    ],
    imports: [
        CommonModule,
        AvaRoutingModule,
        NzLayoutModule,
        NzMenuModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzDropDownModule,
        NzIconModule,
        NzDatePickerModule,
        NzTableModule,
        NzSelectModule,
        NzDrawerModule,
        NzModalModule,
        NzStepsModule,
        NzTabsModule,
        NzSwitchModule,
        NzInputNumberModule,
        NzCheckboxModule,
        NzRadioModule,
        NzSpinModule,
        FormsModule,
        ReactiveFormsModule,
        NzProgressModule
    ]
})
export class AvaModule{}