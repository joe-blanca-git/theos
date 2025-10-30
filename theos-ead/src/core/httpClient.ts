import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class httpClient {
  public TimeOut: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  createAuthorizationHeader(contentTypeFormUrl: boolean = false): HttpHeaders {
    var headers = new HttpHeaders();

    if (!contentTypeFormUrl) {
      headers = headers.append('Content-Type', 'application/json');
    } else {
      headers = headers.append(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );
    }

    headers.append('Accept', 'application/json');
    let language = 'BR';

    let token: any = 'Bearer ' + localStorage.getItem('THEOS.ava.token');
    
    if (language !== null && language !== undefined) {
      headers = headers.append('Accept-Language', language);
    }

    if (token !== null && token !== undefined) {
      headers = headers.append('Authorization', token);
    }
    return headers;
  }

  get(
    url: any,
    showLoading: boolean = true,
    contentTypeFormUrl: boolean = false
  ) {
    return this.ManageLoading(
      this.http.get(url, {
        headers: this.createAuthorizationHeader(),
      }),
      showLoading
    );
  }

  post(
    url: any,
    data: any,
    showLoading = true,
    contentTypeFormUrl: boolean = false
  ) {
    return this.ManageLoading(
      this.http.post(url, data, {
        headers: this.createAuthorizationHeader(contentTypeFormUrl),
      }),
      showLoading
    );
  }

  put(url: any, data: any, showLoading: boolean = true) {
    return this.ManageLoading(
      this.http.put(url, data, {
        headers: this.createAuthorizationHeader(),
      }),
      showLoading
    );
  }

  delete(url: any, showLoading: boolean = true) {
    return this.ManageLoading(
      this.http.delete(url, {
        headers: this.createAuthorizationHeader(),
      }),
      showLoading
    );
  }

  handleError(error: any): Promise<any> {
    if (error['status'] == 401) {
      // this.alertHelper.clearAll();
      // this.alertHelper.create(RequestStatus.Info, { text: "Token Expirado. Por gentileza, faça o login novamente." }, 15000);
      this.router.navigate(['/login'], { replaceUrl: true });
    }
    return Promise.reject(error.message || error);
  }

  private ManageLoading(request: any, showLoading: any): Promise<any> {
    clearTimeout(this.TimeOut);

    this.TimeOut = setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });

      this.Logout();
    }, 3600000);

    return request
      .toPromise()
      .then((result: any) => {
        return result;
      })
      .catch((error: any) => {
        return error;
      });
  }

  private Logout() {
    clearTimeout(this.TimeOut);
  }
}
