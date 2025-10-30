import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageUtils } from '../utils/localstorage';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs';

export interface IUser {
  username: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService extends BaseService {
  private _user: IUser | null = null;

  localStorageUtils = new LocalStorageUtils();

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

  constructor(private router: Router, private http: HttpClient) {
    super();
  }

  login(email: string, password: string) {
    let _username = email;
    let _password = password;

    let json = {
      user: _username,
      password: _password,
    };

    let response = this.http
      .post(this.UrlServiceLoginV1 + 'token.php', json, this.ObterHeaderJson())
      .pipe(map(this.extractData), catchError(this.serviceError));
    console.log(response);
    return response;
  }

  registrar(
    email: string,
    password: string,
    username: string,
    contato: string
  ) {
    let _email = email;
    let _password = password;
    let _username = username;
    let _contato = contato;

    let json = {
      email: _email,
      password: _password,
      username: _username,
      contato: _contato,
    };

    let response = this.http
      .post(
        this.UrlServiceLoginV1 + 'register.php',
        json,
        this.ObterAuthHeaderJson()
      )
      .pipe(map(this.extractData), catchError(this.serviceError));
    return response;
  }

  recuperar(email: string) {
    let _email = email;

    let json = {
      email: _email,
    };

    let response = this.http
      .post(
        this.UrlServiceRecoveryv1 + 'requestPassword.php',
        json,
        this.ObterHeaderJson()
      )
      .pipe(map(this.extractData), catchError(this.serviceError));
    return response;
  }

  alterar(token: string, password: string) {
    let json = {
      token: token,
      password: password,
    };

    let response = this.http
      .post(
        this.UrlServiceRecoveryv1 + 'changePassword.php',
        json,
        this.ObterHeaderJson()
      )
      .pipe(map(this.extractData), catchError(this.serviceError));
    return response;
  }

  logout() {
    this.localStorageUtils.limparDadosLocaisUsuario();
  }
}
