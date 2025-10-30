import { Injectable } from '@angular/core';
import { BaseService } from '../../../../shared/services/base.service';
import { httpClient } from 'src/core/httpClient';

interface TotaisUser {
  cursando: number;
  concluido: number;
  horas: number;
  ttHoras: number;
  progresso: number;
}

@Injectable()
export class buyService {
  _idUser: string = '';

  constructor(public httpClient: httpClient, public apiService: BaseService) {}

  public postBuyCourse(course: any) {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      return Promise.reject('Usuário não encontrado');
    }

    let url = this.apiService.urlPostBuyCourse;

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    course.User = this._idUser;
    return new Promise((resolve, reject) => {
      this.httpClient.post(url, course, true, false).then(
        (response: any) => {
          let result: any;
          if (JSON.stringify(response) === '') {
            result = '';
          }
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

}
