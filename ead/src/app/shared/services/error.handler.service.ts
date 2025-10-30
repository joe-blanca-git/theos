import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, onErrorResumeNext } from 'rxjs/operators';
import { LocalStorageUtils } from '../utils/localstorage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  localStorageUtil = new LocalStorageUtils();

  //Metodo de interceptacao
  //req: requisição
  //next: handler, é como se fosse o pipeline, vai sempre chamar a proxima ação
  //retorna uma observable que é um evento Http de qualquer tipo
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    //sera tratado somente os retornos de erros, mas poderia tratar por exemplo todos os requests e inserior o token aqui

    //o handle retorna uma observable
    return next.handle(req).pipe(
      catchError((err) => {
        //se o erro é uma instancia do erro de resposta
        if (err instanceof HttpErrorResponse) {
          //erro 401 o destino não conhece quem é
          // if (err.status === 401){
          //     this.localStorageUtil.limparDadosLocaisUsuario();
          //     notify("Token de acesso expirou, por favor logue novamente!", 'error', 3000);
          //     this.router.navigate(['/login-form'])
          // }

          //erro 403 o destino conhece quem é mas o acesso a alguam rotina especifica não é permitido
          if (err.status === 403) {
            this.router.navigate(['/acesso-negado']);
          }
        }

        //return throwError(err);
        return throwError(() => err);
      }),
    );
  }
}
