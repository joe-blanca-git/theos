import { Injectable } from '@angular/core';
import { LocalStorageUtils } from '../utils/localstorage';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';

export interface IUser {
  username: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private _user: IUser | null = null;

  localStorageUtils = new LocalStorageUtils();
  
  constructor(private router: Router, private http: HttpClient) {
    super();
  }

  get loggedIn(): boolean {
    var usuarioLogado = this.localStorageUtils.obterUsuario();
    if (usuarioLogado) {
      var username = usuarioLogado.username;
      this._user = { username };
    } else {
      this._user = null;
    }

    return !!this._user;
  }

    login(email: string, password: string) {
      let _username = email;
      let _password = password;

      let json = {
        user: _username,
        password: _password,
      };

      let response = this.http
        .post(this.UrlAuth + 'auth', json, this.ObterHeaderJson())
        .pipe(map(this.extractData), catchError(this.serviceError));
      return response;
    }
}
