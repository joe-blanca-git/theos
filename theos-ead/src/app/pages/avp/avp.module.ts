import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { avpRoutingModule } from './avp.route';
import { AvpHomeComponent } from './avp-home/avp-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { avpAppComponent } from './avp.component';
import { AvpCursosComponent } from './avp-cursos/avp-cursos.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NewCursoComponent } from './avp-cursos/components/new-curso/new-curso.component';
import { AvpCursoDetalheComponent } from './avp-curso-detalhe/avp-curso-detalhe.component';


@NgModule({
  declarations: [
    avpAppComponent,
    AvpHomeComponent, 
    AvpCursosComponent, 
    NewCursoComponent, 
    AvpCursoDetalheComponent, 
  ],
  imports: [
    CommonModule,
    avpRoutingModule,
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
    NzProgressModule,
    NzUploadModule,
    NzTimePickerModule
    
  ],
})
export class AvpModule {}
