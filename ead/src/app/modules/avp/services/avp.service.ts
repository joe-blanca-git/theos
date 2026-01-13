import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../../shared/services/base.service';
import { firstValueFrom } from 'rxjs';
import {
  CourseCategoryModel,
  CourseModel,
  TeachersModel,
} from '../models/avp.models';

@Injectable({
  providedIn: 'root',
})
export class AvpService extends BaseService {
  constructor(private router: Router, private httpClient: HttpClient) {
    super();
  }

  async getTeachers(): Promise<TeachersModel[]> {
    const url = `${this.UrlServiceV1}avp/shared/get_teacher`;

    try {
      const response = await firstValueFrom(
        this.httpClient.get<any[]>(url, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async getCourseCategory(): Promise<CourseCategoryModel[]> {
    const url = `${this.UrlServiceV1}avp/course/get_course_catogory`;

    try {
      const response = await firstValueFrom(
        this.httpClient.get<any[]>(url, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async getCourse(id: number): Promise<CourseModel[]> {
    const url = `${this.UrlServiceV1}avp/course/course?user=${id}`;

    try {
      const response = await firstValueFrom(
        this.httpClient.get<any[]>(url, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async getCourseId(userId: number, courseId: string | null): Promise<CourseModel> {
    const url = `${this.UrlServiceV1}avp/course/course?user=${userId}&curso=${courseId}`;

    try {
      const response = await firstValueFrom(
        this.httpClient.get<any[]>(url, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async postCourse(body: any): Promise<any> {
    const url = `${this.UrlServiceV1}avp/course/new_course`;

    try {
      const response = await firstValueFrom(
        this.httpClient.post(url, body, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async putCourse(body: any): Promise<any> {
    const url = `${this.UrlServiceV1}avp/course/update_course`;

    try {
      const response = await firstValueFrom(
        this.httpClient.put(url, body, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  async postModule(body: any): Promise<any> {
    const url = `${this.UrlServiceV1}avp/course/new_module`;

    try {
      const response = await firstValueFrom(
        this.httpClient.post(url, body, this.ObterAuthHeaderJson())
      );

      return this.extractData(response);
    } catch (error) {
      throw error;
    }
  }

  postLessonFormData(formData: FormData) {
  const token = localStorage.getItem('token'); // ou como você já usa para pegar o token
  const url = this.UrlServiceV1 + 'avp/course/new_lesson';

  return firstValueFrom(
    this.httpClient.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // NÃO coloque Content-Type aqui!!
        // O navegador define automaticamente o multipart/form-data correto.
      }
    })
  );
}

}
