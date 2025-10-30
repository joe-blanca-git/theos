import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  CourseCategoryModel,
  CourseModel,
  TeachersModel,
} from '../../models/avp.models';
import { FormCourseComponent } from '../../components/forms/form-course/form-course.component';
import { FormModuleComponent } from '../../components/forms/form-module/form-module.component';
import { FormLeassonComponent } from '../../components/forms/form-leasson/form-leasson.component';
import { AvpService } from '../../services/avp.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageUtils } from '../../../../shared/utils/localstorage';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormCourseComponent,
    FormModuleComponent,
    FormLeassonComponent,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  @ViewChild(FormCourseComponent) formCourse!: FormCourseComponent;
  @ViewChild(FormModuleComponent) formModule!: FormModuleComponent;

  public LocalStorage = new LocalStorageUtils();

  dataCourse!: CourseModel;
  listTeachers: TeachersModel[] = [];
  listCourseCategorys: CourseCategoryModel[] = [];

  isLoadingData = false;

  courseId!: string | null;
  user: any;

  constructor(private avpService: AvpService, private route: ActivatedRoute) {
    this.user = this.LocalStorage.obterUsuario();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.courseId = params.get('curso');
    });
    this.loadData();
  }

  async loadData() {
    this.isLoadingData = true;

    try {
      this.listTeachers = await this.avpService.getTeachers();

      this.listCourseCategorys = await this.avpService.getCourseCategory();

      this.dataCourse = await this.avpService.getCourseId(
        this.user.id,
        this.courseId
      );

     await  this.formCourse.inPutData(this.dataCourse);
      
      //await this.loadInfo();
    } catch (error) {
    } finally {
      this.isLoadingData = false;
      console.log('complete');
    }
  }
}
