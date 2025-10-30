import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewCourseComponent } from '../../components/new-course/new-course.component';
import { AvpService } from '../../services/avp.service';
import {
  CourseCategoryModel,
  CourseModel,
  TeachersModel,
} from '../../models/avp.models';
import { LocalStorageUtils } from '../../../../shared/utils/localstorage';
import { RouterModule } from '@angular/router';

interface ItemData {
  title: string;
  category: string;
  duration: string;
  data: string;
  status: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDatePickerModule,
    NzInputModule,
    NewCourseComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public LocalStorage = new LocalStorageUtils();

  dash: any[] = [];

  listOfColumn = [
    {
      title: 'Titulo do Curso',
      compare: (a: ItemData, b: ItemData) => a.title.localeCompare(b.title),
      priority: false,
    },
    {
      title: 'Categoria',
      compare: (a: ItemData, b: ItemData) =>
        a.category.localeCompare(b.category),
      priority: 3,
    },
    {
      title: 'Duração (segundos)',
      compare: (a: ItemData, b: ItemData) =>
        a.duration.localeCompare(b.duration),
      priority: 2,
    },
    {
      title: 'Status',
      compare: (a: ItemData, b: ItemData) => a.status.localeCompare(b.status),
      priority: false,
    },
    {
      title: 'Criação',
      compare: (a: ItemData, b: ItemData) => a.data.localeCompare(b.data),
      priority: 1,
    },
  ];

  date = null;
  pageTitle = 'AVP - Área Vitural do Professor';
  pageDescription = 'Gestão de Cursos destinada ao professor THEOS.';
  pageIcon = 'fa-solid fa-person-chalkboard';
  operation: number = 0;

  listTeachers: TeachersModel[] = [];
  listCourseCategorys: CourseCategoryModel[] = [];
  listCourses: CourseModel[] = [];
  dataCourse!: CourseModel;

  isLoadingData = false;
  statusNewCourse = false;
  user: any;

  constructor(private avpService: AvpService) {
    this.user = this.LocalStorage.obterUsuario();
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.isLoadingData = true;

    try {
      //this.listTeachers = await this.avpService.getTeachers();
      this.listCourseCategorys = await this.avpService.getCourseCategory();
      this.listTeachers = await this.avpService.getTeachers();
      this.listCourses = await this.avpService.getCourse(this.user.id);

      await this.loadInfo();
    } catch (error) {
    } finally {
      this.isLoadingData = false;
    }
  }

  loadInfo() {
    this.dash = [
      {
        title: 'Meus Cursos',
        value: this.listCourses.length,
        icon: 'fa fa-book',
        color: 'danger',
        notView: 0,
      },
      {
        title: 'Fórum',
        value: 0,
        icon: 'fa fa-message',
        color: 'info',
        notView: 15,
      },
    ];
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  statusChangeNewCourse(status: boolean, data: any, operation: number){
    this.statusNewCourse = status;
    this.operation = operation;
    if (data) {
      this.dataCourse = data;
    }
  }

}
