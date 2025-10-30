import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { httpClient } from 'src/core/httpClient';
import { cursosLandingModel } from '../models/curso-landing.model';
import { cursoPreviewModel } from '../models/cursoPreview.model';

@Injectable()
export class landingService {
  _idUser: string = '';

  constructor(
    public httpClient: httpClient, 
    public apiService: BaseService) {}

  public getCursos(): Promise<any> {

    let url = this.apiService.urlGetCursos;

    return new Promise((resolve, reject) => {
      this.httpClient.get(url,true,false).then((response : any) => {
        let cursos: cursosLandingModel[] = [];
        if(JSON.stringify(response) === '{}'){
          cursos = [];
        }else {
          for(const item of response){
            cursos.push(new cursosLandingModel().mapFromApi(item));
          }
        }
        resolve(cursos);
      }, (err) => {
        reject(err);
      })
    })
  }

  public getPreview(_idCurso: any): Promise<any> {
    let url = this.apiService.urlGetPreview;
    url = url.replace('{IdCurso}', _idCurso);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url,true,false).then((response : any) => {
        let cursos: cursosLandingModel[] = [];
        if(JSON.stringify(response) === '{}'){
          cursos = [];
        }else {
          for(const item of response){
            cursos.push(new cursosLandingModel().mapFromApi(item));
          }
        }
        resolve(cursos);
      }, (err) => {
        reject(err);
      })
    })
  }
}
