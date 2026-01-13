import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageUtils } from '../utils/localstorage';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor() {}

  public LocalStorage = new LocalStorageUtils();

  public UrlServiceV1: string = environment.apiUrlv1;
  protected UrlAuth: string = environment.apiUrlLoginv1;

  protected ObterHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  protected ObterHeaderUnlercoded() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  }

  protected ObterAuthHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.LocalStorage.obterTokenUsuario(),
      }),
    };
  }

  protected extractData(response: any) {
    return response || {};
  }

  protected serviceError(response: Response | any) {
    let CustomError: string[] = [];

    if (response instanceof HttpErrorResponse) {
      if (response.statusText === 'Unknown Error') {
        //CustomError.push("Ocorreu um erro desconhecido");
        //response.error.errors = CustomError;

        return throwError(
          () => 'Falha na comunicação - tente novamente mais tarde'
        );
      } else if (response.status === 400) {
        CustomError.push('Erros de validação');
        response.error.errors = CustomError;
      } else if (response.status === 401) {
        this.LocalStorage.limparDadosLocaisUsuario();
        return throwError(() => 'Sem autorização');
      } else if (response.status === 403) {
        return throwError(() => 'Sem autorização');
      } else if (response.status === 409) {
        return throwError(() => 'Usuário já Existe');
      }
    }

    //console.error(response.error);
    return throwError(() => response);
  }
}
