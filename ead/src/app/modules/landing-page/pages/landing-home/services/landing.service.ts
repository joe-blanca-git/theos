import { Injectable } from '@angular/core';
import { BaseService } from '../../../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { LandingCoursesModel } from '../models/landing.model';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  constructor(
    private httpClient: HttpClient,
    private apiService: BaseService
  ) {}

  public getCourses(): Promise<LandingCoursesModel> {
    const url = `${this.apiService.UrlServiceV1}/landing/home`;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url).subscribe({
        next: (response:any) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }
}
