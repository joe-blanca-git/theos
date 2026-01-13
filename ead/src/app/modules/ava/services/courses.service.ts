import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { CourseDetailModel, LatestCoursesModel } from '../models/courses.model';
import { PaymentModel } from '../../../shared/models/payment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  public getCourseDetail(courseId: number): Promise<CourseDetailModel> {
    const url = `${this.UrlServiceV1}avat/course_detail?courseId=${courseId}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, this.ObterAuthHeaderJson()).subscribe({
        next: (response: any) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  public getPayment(paymentId: string): Promise<PaymentModel> {
    const url = `${this.UrlServiceV1}payment/get_payment?paymentId=${paymentId}`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, this.ObterAuthHeaderJson()).subscribe({
        next: (response: any) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  public getLatestCourses(): Promise<LatestCoursesModel[]> {
    const url = `${this.UrlServiceV1}avat/latest`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, this.ObterAuthHeaderJson()).subscribe({
        next: (response: any) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  public getTopThen(): Promise<LatestCoursesModel[]> {
    const url = `${this.UrlServiceV1}avat/top`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, this.ObterAuthHeaderJson()).subscribe({
        next: (response: any) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }
}
