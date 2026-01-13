import { Injectable } from '@angular/core';
import { LocalStorageUtils } from '../utils/localstorage';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';

export interface UserRegisterRequest {
  email: string;
  password: string;
  username: string;
  phone: string;
  Street: string;
  IdCity: string | number;
  IdState: string | number;
  ZipCode: string;
  cpfCnpj: string;
}

export interface UserRecoveryRequest {
  email?: string;
}

export interface IUser {
  username: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private _user: IUser | null = null;
  localStorageUtils = new LocalStorageUtils();

  constructor(private router: Router, private http: HttpClient) {
    super();
  }

  get loggedIn(): boolean {
    const usuarioLogado = this.localStorageUtils.obterUsuario();
    if (usuarioLogado) {
      this._user = { username: usuarioLogado.username };
    } else {
      this._user = null;
    }
    return !!this._user;
  }

  login(email: string, password: string) {
    const json = {
      user: email,
      password: password,
    };

    return this.http
      .post(this.UrlAuth + 'auth', json, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  logout(){
    this.LocalStorage.limparDadosLocaisUsuario();
    this.router.navigate(['/auth/login'])
  }

  register(user: UserRegisterRequest): Observable<any> {
    const endpoint = this.UrlAuth + 'register_user';

    return this.http
      .post(endpoint, user, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  recovery(user: UserRecoveryRequest): Observable<any> {
    const endpoint = this.UrlAuth + 'request_recovery';

    return this.http
      .post(endpoint, user, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  completePasswordReset(token: string, newPassword: string): Observable<any> {
    const endpoint = this.UrlAuth + 'replace_password';

    const payload = {
      token: token,
      password: newPassword,
    };

    return this.http
      .post(endpoint, payload, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
}
