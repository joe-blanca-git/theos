import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { cursosModel } from '../models/cursosModel';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


interface TotaisUser {
  cursando: number;
  concluido: number;
  horas: number;
  ttHoras: number;
  progresso: number;
}

@Injectable()
export class avpService extends BaseService {
  _idUser: string = '';

  constructor(
    public httpClient: HttpClient, 
  ) {
    super()
  }
  
  public getCursos(cursoId: any): Observable<cursosModel[]> {
    const userJson = localStorage.getItem('THEOS.ava.user');
  
    if (!userJson) {
      return throwError(() => new Error('Usuário não encontrado'));
    }
  
    const user = JSON.parse(userJson);
    this._idUser = user.id;
  
    let url = this.urlGetCursosAvp.replace('{UserId}', this._idUser);
    url = cursoId ? url.replace('{CursoId}', cursoId) : url.replace('&Curso={CursoId}', '');
  
    return this.httpClient.get<cursosModel[]>(url, this.ObterAuthHeaderJson()).pipe(
      map((response: any[]) => response.map(item => new cursosModel().mapFromApi(item)))
    );
  }

  public inactiveCourse(cursoId: number){
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id
    } else {
      console.error('Usuário não encontrado');
    }

    let url = this.urlInativeCursosAvp.replace('{UserId}', this._idUser);
    url = cursoId ? url.replace('{CursoId}', String(cursoId)) : url.replace('&Curso={CursoId}', '');

    return this.httpClient
      .put(url,null,this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );

  }
  
  public postCursos(bodyJson: any){

    const userJson = localStorage.getItem('THEOS.ava.user');

    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id
    } else {
      console.error('Usuário não encontrado');
    }

    let url = this.urlPostCursosAvp;

    const updateBody = {
      ...bodyJson,
      User: this._idUser,
      Curso: {
        ...bodyJson.Curso,
        autor: this._idUser
      }
    }

    return this.httpClient
      .post(url, updateBody,this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );

  }

  public postModulo(bodyJson: any) {
    const userJson = localStorage.getItem('THEOS.ava.user');
  
    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id;
    } else {
      console.error('Usuário não encontrado');
    }
  
    let url = this.urlPostModulosAvp;
  
    const updateBody = {
      User: this._idUser,
      Modulo: {
        ...bodyJson.Modulo, 
        Professor: this._idUser,
        User: this._idUser, 
      }
    };    
  
    return this.httpClient
      .post(url, updateBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  public postAula(bodyJson: any) {
    const userJson = localStorage.getItem('THEOS.ava.user');
  
    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id;
    } else {
      console.error('Usuário não encontrado');
    }
  
    let url = this.urlPostAulasAvp;
  
    const updateBody = {
      User: this._idUser,
      Aula: {
        ...bodyJson.Aula, 
        User: this._idUser, 
      }
    };    
  
    return this.httpClient
      .post(url, updateBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  public deleteModulo(moduloId: number, cursoId: number) {
    const userJson = localStorage.getItem('THEOS.ava.user');
  
    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id;
    } else {
      console.error('Usuário não encontrado');
      return; 
    }
  
    let url = this.urlDeleteModulo
      .replace('{UserId}', String(this._idUser))
      .replace('{CursoId}', String(cursoId))
      .replace('{ModuloId}', String(moduloId));
  
    return this.httpClient
      .delete(url, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  public deleteAula(aulaId: number, moduloId: number) {
    const userJson = localStorage.getItem('THEOS.ava.user');
  
    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id;
    } else {
      console.error('Usuário não encontrado');
      return; 
    }
  
    let url = this.urlDeleteAula
      .replace('{UserId}', String(this._idUser))
      .replace('{ModuloId}', String(moduloId))
      .replace('{AulaId}', String(aulaId));
  
    return this.httpClient
      .delete(url, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  public saveInfoCurso(bodyJson: any){
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (userJson) {
      const user = JSON.parse(userJson);
      this._idUser = user.id
    } else {
      console.error('Usuário não encontrado');
    }

    let url = this.urlUpdateInfo;

    const updateBody = {
      ...bodyJson,
      User: this._idUser,
    }
    
    return this.httpClient
    .put(url, updateBody,this.ObterAuthHeaderJson())
    .pipe(
      map((data) => this.extractData(data)),
      catchError(this.serviceError)
    );

  }

}
