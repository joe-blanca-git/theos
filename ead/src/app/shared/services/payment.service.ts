import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageUtils } from '../utils/localstorage';
import { IUser } from './auth.service';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService {
  localStorageUtils = new LocalStorageUtils();

  constructor(private router: Router, private http: HttpClient) {
    super();
  }

  createPayment(body: any, courseId: number) {
    const url = `${this.UrlServiceV1}payment/buy_course?courseId=${courseId}`;
    return this.http
      .post(url, body, this.ObterAuthHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
}
