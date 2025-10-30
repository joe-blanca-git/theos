import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { httpClient } from 'src/core/httpClient';
import { cursosModel } from '../models/cursosModel';
import { aulaViewModel } from '../models/aulaView.model';
import { totaisUserModel } from 'src/app/pages/ava/models/totaisUser.model';
import { cursoPreviewModel } from 'src/app/pages/landing/models/cursoPreview.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { ModulosModel } from '../models/cursoModulos.model';

interface TotaisUser {
  cursando: number;
  concluido: number;
  horas: number;
  ttHoras: number;
  progresso: number;
}

@Injectable()
export class avaService extends BaseService {
  _idUser: string = '';

  constructor(
    public httpClient: httpClient, 
    public HttpClient: HttpClient, 
    public apiService: BaseService) {
    super()
  }

  getTotaisCursos(): Promise<totaisUserModel> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetTotaisUser;
    url = url.replace('{UserId}', this._idUser);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          resolve(response)
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getCursando(): Promise<any> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetCursando;
    url = url.replace('{UserId}', this._idUser);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getCursos(categoria: string, curso: string): Promise<any> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetCursosAva;
    url = url.replace('{UserId}', this._idUser);

    if (categoria) {
      url = url.replace('{categoriaId}', categoria);
    } else {
      url = url.replace('&categoriaId={categoriaId}', '');
    }

    if (curso) {
      url = url.replace('{cursoId}', curso);
    } else {
      url = url.replace('&cursoId={cursoId}', '');
    }

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          let cursos: cursosModel[] = [];
          if (JSON.stringify(response) === '{}') {
            cursos = [];
          } else {
            for (const item of response) {
              cursos.push(new cursosModel().mapFromApi(item));
            }
          }
          resolve(cursos);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getEstados(): Promise<any> {
    const url = `https://brasilapi.com.br/api/ibge/uf/v1`;

    return this.httpClient.get(url, true, false).then((response: any) => {
      if (response && typeof response === 'object') {
        return response;
      } else {
        return Promise.reject('Resposta inválida da API');
      }
    });
  }

  getCidades(estado: string): Promise<any> {
    const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${estado}?providers=dados-abertos-br,gov,wikipedia`;

    return this.httpClient.get(url, true, false).then((response: any) => {
      if (response && typeof response === 'object') {
        return response;
      } else {
        return Promise.reject('Resposta inválida da API');
      }
    });
  }

  getProfile(): Promise<any> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetProfile;
    url = url.replace('{UserId}', this._idUser);

    return this.httpClient
      .get(url, true, false)
      .then((response: any) => {
        if (response && typeof response === 'object') {
          return response;
        } else {
          //console.error('origem: Ava Service - Resposta inválida da API:', response);
          return Promise.reject('Resposta inválida da API');
        }
      })
      .catch((err) => {
        console.error('Erro ao obter perfil:', err);
        return Promise.reject(err);
      });
  }

  putProfile(item: any) {
    const userJson = localStorage.getItem('THEOS.ava.user') || '';
    const user = JSON.parse(userJson);
    this._idUser = user.id;
  
    if (typeof item === 'string') {
      item = JSON.parse(item);
    }
  
    item.User = this._idUser;
  
    const url = this.apiService.urlPutProfile;
  
    return this.HttpClient
      .put(url, item, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  getModulos(cursoId: any){
    const userJson = localStorage.getItem('THEOS.ava.user') || '';
    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetModulos;
    url = url.replace('{UserId}', this._idUser);
    url = url.replace('{cursoId}', cursoId);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          let aula: ModulosModel[] = [];
          if (JSON.stringify(response) === '{}') {
            aula = [];
          } else {
            for (const item of response) {
              aula.push(new ModulosModel().mapFromApi(item));
            }
          }
          resolve(aula);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getLastVideo(cursoId: any, aulaId: any): Promise<any> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetLastVideo;
    url = url.replace('{UserId}', this._idUser);
    url = url.replace('{CursoId}', cursoId);
    url = url.replace('{AulaId}', aulaId);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getAulaView(cursoId: any, aulaId: any): Promise<any> {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetAulaView;
    url = url.replace('{UserId}', this._idUser);
    url = url.replace('{CursoId}', cursoId);
    url = url.replace('{ModuloId}', aulaId);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          let aula: aulaViewModel[] = [];
          if (JSON.stringify(response) === '{}') {
            aula = [];
          } else {
            for (const item of response) {
              aula.push(new aulaViewModel().mapFromApi(item));
            }
          }
          resolve(aula);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  postMarkView(item: any) {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlPostMarkView;

    // Adiciona o id do usuário ao item
    item.User = this._idUser;

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, item, true, false).then(
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

  postFinishLesson(item: any) {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      //console.error('Usuário não encontrado');
      return Promise.reject('Usuário não encontrado');
    }

    let url = this.apiService.urlPostFinishLesson;

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    // Adiciona o id do usuário ao item
    item.User = this._idUser;

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, item, true, false).then(
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
  

  ////////////////////////////////////////////




  getPreview(_idCurso: any): Promise<any> {
    let url = this.apiService.urlGetPreview;
    url = url.replace('{IdCurso}', _idCurso);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url, true, false).then(
        (response: any) => {
          let cursos: cursoPreviewModel[] = [];
          if (JSON.stringify(response) === '{}') {
            cursos = [];
          } else {
            for (const item of response) {
              cursos.push(new cursoPreviewModel().mapFromApi(item));
            }
          }
          resolve(cursos);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getCertificados() {
    const userJson = localStorage.getItem('THEOS.ava.user');

    if (!userJson) {
      return Promise.reject('Usuário não encontrado');
    }

    const user = JSON.parse(userJson);
    this._idUser = user.id;

    let url = this.apiService.urlGetCertificados;
    url = url.replace('{UserId}', this._idUser);

    return this.httpClient
      .get(url, true, false)
      .then((response: any) => {
        if (response && typeof response === 'object') {
          return response;
        } else {
          //console.error('origem: Ava Service - Resposta inválida da API:', response);
          return Promise.reject('Resposta inválida da API');
        }
      })
      .catch((err) => {
        console.error('Erro ao obter perfil:', err);
        return Promise.reject(err);
      });
  }
}
