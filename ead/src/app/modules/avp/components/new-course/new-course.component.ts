import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NotificationService } from '../../../../shared/services/notification.service';
import { FormCourseComponent } from '../forms/form-course/form-course.component';
import {
  FormModuleComponent,
  IModule,
} from '../forms/form-module/form-module.component';
import { FormLeassonComponent } from '../forms/form-leasson/form-leasson.component';
import { LocalStorageUtils } from '../../../../shared/utils/localstorage';
import { AvpService } from '../../services/avp.service';
import { CourseModel, TeachersModel } from '../../models/avp.models';

export interface IDisplayModule {
  ModuleOrder: number;
  Name: string;
  Teacher: number | string;
  Img: string;
  Description: string;
}

export interface IDisplayLesson {
  ordem: number;
  Lesson: string;
  DescriptionLarge: string;
  DescriptionSmall: string;
  VideoBin: string;
  Duration: number | string;
  ModuloOrdem: number;
  Name: string;
}

@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzStepsModule,
    NzTableModule,
    ɵInternalFormsSharedModule,
    FormCourseComponent,
    FormModuleComponent,
    FormLeassonComponent,
  ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.scss',
})
export class NewCourseComponent {
  @ViewChild(FormCourseComponent) formCourse!: FormCourseComponent;
  @ViewChild(FormModuleComponent) formModule!: FormModuleComponent;
  @ViewChild(FormLeassonComponent) FormLeasson!: FormLeassonComponent;
  @Input('statusModal') isVisible: boolean = false;
  @Input('listTeachers') listTeachers: TeachersModel[] = [];
  @Input('listCourseCategories') listCourseCategories: any[] = [];
  @Input('dataCourse') dataCourse!: CourseModel;
  @Output() statusChange = new EventEmitter<boolean>();

  public LocalStorage = new LocalStorageUtils();

  listOfColumnsModules: { title: string; key: keyof IDisplayModule }[] = [
    { title: 'Ordem', key: 'ModuleOrder' },
    { title: 'Módulo', key: 'Name' },
    { title: 'Professor', key: 'Teacher' },
    { title: 'Capa', key: 'Img' },
  ];

  listOfColumnsLessons: { title: string; key: keyof IDisplayLesson }[] = [
    { title: 'Ordem', key: 'ordem' },
    { title: 'Aula', key: 'Lesson' },
    { title: 'Duração', key: 'Duration' },
  ];

  listOfModules: IDisplayModule[] = [];

  listOfLessons: Record<string, any>[] = [];

  listOfTeachers: any[] = [];

  bodyCourse: any;

  current = 0;

  user: any;

  isLoading = false;
  progressLoading = 0;
  progressLabel = '';

  constructor(
    private notificationService: NotificationService,
    private avpService: AvpService
  ) {
    this.user = this.LocalStorage.obterUsuario();
  }

  ngOnInit(): void {}

  recieveModule(module: IModule) {
    const newModule: IDisplayModule = {
      ModuleOrder: this.listOfModules.length + 1,
      Name: module.Modulo.Name,
      Teacher: module.Modulo.Teacher,
      Img: module.Modulo.Img,
      Description: module.Modulo.Description
    };

    this.listOfModules = [...this.listOfModules, newModule];
  }

  recieveLesson(lesson: any) {
    console.log(lesson);
    
    const newLesson: IDisplayLesson = {
      ordem: this.listOfLessons.length + 1,
      Lesson: lesson.Lesson.Name,
      DescriptionLarge: lesson.Lesson.DescriptionLarge,
      DescriptionSmall: lesson.Lesson.DescriptionSmall,
      VideoBin: lesson.Lesson.VideoBin,
      Duration: lesson.Lesson.DurationSeconds,
      ModuloOrdem: lesson.Lesson.ModuleId,
      Name: lesson.Lesson.Name,
    };

    this.listOfLessons = [...this.listOfLessons, newLesson];
  }

  pre(): void {
    this.current -= 1;
  }

async next(): Promise<void> {
  try {
    if (this.current === 0) {
      if (!this.formCourse) return;

      const formCourseData = this.formCourse.outPutData();
      if (!formCourseData) return;

      this.bodyCourse = {
        Curso: {
          Author: this.user.id,
          User: this.user.id,
          Name: formCourseData.Name,
          Description: formCourseData.DescriptionSmall,
          DescriptionLarge: formCourseData.DescriptionLarge,
          ImgPoster: formCourseData.Image,
          ImgHeader: 'a',
          CategoryId: formCourseData.CategoryId,
          Price: formCourseData.Price
        },
        Modulos: []
      };

      this.current += 1;
      return;
    }

    if (this.current === 1) {
      if (!this.formModule) return;

      if (!this.listOfModules || this.listOfModules.length === 0) {
        this.notificationService.show(
          'warning',
          'Atenção!',
          'Adicione pelo menos 1 Módulo ao Curso!',
          5000
        );
        return;
      }

      this.bodyCourse.Modulos = this.listOfModules.map((m: any) => ({
        ...m,
        Lessons: []
      }));

      this.current += 1;
      return;
    }

    if (this.current === 2) {
      if (!this.FormLeasson) return;

      if (!this.listOfLessons || this.listOfLessons.length === 0) {
        this.notificationService.show(
          'warning',
          'Atenção!',
          'Adicione pelo menos 1 Aula ao Curso!',
          5000
        );
        return;
      }

      for (const aula of this.listOfLessons) {
        const moduloIndex = this.bodyCourse.Modulos.findIndex(
          (m: any) =>
            Number(m['ModuleOrder']) === Number(aula['ModuloOrdem'])
        );

        if (moduloIndex !== -1) {
          this.bodyCourse.Modulos[moduloIndex].Lessons.push(aula);
        }
      }
      console.log(this.listOfLessons);
      
      console.log(this.bodyCourse);
      
      this.current += 1;
      return;
    }
  } catch (error) {
    console.error('Erro no processo:', error);
    this.notificationService.show(
      'error',
      'Erro!',
      'Ocorreu um erro ao avançar o cadastro do curso.',
      5000
    );
  }
}




  async done(): Promise<void> {
    // Garante que temos o que salvar
    if (!this.bodyCourse || !this.bodyCourse.Curso) {
      console.error('Dados do curso incompletos para iniciar o cadastro.');
      return;
    }

    console.log('Dados completos do curso:', JSON.stringify(this.bodyCourse));

    this.isLoading = true;
    this.progressLoading = 5;

    // Calcula o total de passos para uma barra de progresso mais precisa
    const totalModules = this.bodyCourse.Modulos.length;
    const totalLessons = this.bodyCourse.Modulos.reduce(
      (sum:any, modulo:any) => sum + (modulo.Lessons?.length || 0),
      0
    );
    const totalSteps = 1 + totalModules + totalLessons; 
    let stepsCompleted = 0;

    try {
      // === ETAPA 1: Cadastrar o Curso ===
      this.progressLabel = '1/3 - Cadastrando informações do curso...';
      const courseResponse: any = await this.avpService.postCourse(
        this.bodyCourse
      );

      if (!courseResponse?.courseId) {
        throw new Error(
          'Falha ao obter o ID do curso. A criação foi interrompida.'
        );
      }
      const courseId = courseResponse.courseId;

      stepsCompleted++;
      const percentage = (stepsCompleted / totalSteps) * 100;
      this.progressLoading = parseFloat(percentage.toFixed(2)); ;

      // === ETAPA 2: Cadastrar os Módulos e suas Aulas ===
      this.progressLabel = `2/3 - Cadastrando ${totalModules} módulos...`;

      // Loop principal para os MÓDULOS
      for (const modulo of this.bodyCourse.Modulos) {
        // Prepara o payload do módulo, associando ao curso recém-criado
        const modulePayload = {
          Modulo:{
            ...modulo,
            Lessons: undefined,
            CourseId: courseId,
            User: this.user.id
          }
        };

        const moduleResponse: any = await this.avpService.postModule(
          modulePayload
        );

        if (!moduleResponse?.moduleId) {
          console.error('Falha ao cadastrar o módulo:', modulo.Name);
          continue;
        }
        const moduleId = moduleResponse.moduleId;

        stepsCompleted++;
        this.progressLoading = (stepsCompleted / totalSteps) * 100;

        // === ETAPA 3: Cadastrar as AULAS (loop aninhado) ===
        this.progressLabel = `3/3 - Cadastrando aulas do módulo "${modulo.Name}"...`;
        
        if (modulo.Lessons && modulo.Lessons.length > 0) {
          
          for (const lesson of modulo.Lessons) {

            const formData = new FormData();
              formData.append('video', lesson.VideoBin.get('video'));
              formData.append('Name', lesson.Name);
              formData.append('DescriptionLarge', lesson.DescriptionLarge);
              formData.append('DescriptionSmall', lesson.DescriptionSmall);
              formData.append('DurationSeconds', lesson.Duration);
              formData.append('ModuleId', moduleId);
              formData.append('CourseId', courseId);
              formData.append('UserIncId', this.user.id);

              await this.avpService.postLessonFormData(formData);

            stepsCompleted++;
            this.progressLoading = (stepsCompleted / totalSteps) * 100;
          }
        }
      }

      this.progressLabel = 'Curso cadastrado com sucesso!';
      this.progressLoading = 100;

    } catch (error: any) {
      this.progressLabel = 'Ocorreu um erro!';
      this.notificationService.show(
        'error',
        'Erro no Cadastro',
        error.message ||
          'Falha ao criar o curso. Verifique os dados e tente novamente.',
        7000
      );
    } finally {
      // Mantém o resultado na tela por um tempo antes de esconder o loading
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }

  handleOk(): void {
    this.isVisible = false;
    this.statusChange.emit(false);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.statusChange.emit(false);
  }
}
