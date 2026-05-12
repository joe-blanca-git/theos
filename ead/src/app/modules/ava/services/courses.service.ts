import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { CourseDetailModel, LatestCoursesModel, LearnLesson } from '../models/courses.model';
import { PaymentModel, PaymentsModel } from '../../../shared/models/payment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

 public getLearn(
  courseId: number,
  moduleId: number,
  lessonId: number
): Observable<LearnLesson> {

  const url = `${this.UrlServiceV1}avat/learn_lesson?courseId=${courseId}&moduleId=${moduleId}&lessonId=${lessonId}`;

  return this.httpClient.get<LearnLesson>(
    url,
    this.ObterAuthHeaderJson()
  );
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

  public getPayments(paymentId: string | null): Promise<PaymentsModel[]> {

    let url = `${this.UrlServiceV1}payment/get_payments`;

    if (paymentId) {
      url = url + `?paymentId=${paymentId}`
    }

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
