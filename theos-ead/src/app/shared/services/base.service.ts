//não vai ser um serviço do tipo injectable, vai ser uma classe abstrata
//Aqui vai tudo que será reutilizado pelos serviços

import { HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError } from "rxjs";
import { environment } from "../../../environments/environment.prod";
import { LocalStorageUtils} from '../utils/localstorage';

export  class BaseService{
  constructor(
   ) { }
    public LocalStorage = new LocalStorageUtils();

    protected UrlServiceV1: string = environment.apiUrlv1;
    //urls validas
    public urlGetProfile = `${this.UrlServiceV1}ava/user/getProfile.php?User={UserId}`;
    public urlPutProfile = `${this.UrlServiceV1}ava/user/putProfile.php`;
    public urlGetTotaisUser = `${this.UrlServiceV1}ava/user/getTotaisUser.php?User={UserId}`;
    public urlGetCursando = `${this.UrlServiceV1}ava/user/getCursando.php?User={UserId}`;
    public urlGetCursosAva = `${this.UrlServiceV1}ava/curso/getCursos.php?User={UserId}&categoriaId={categoriaId}&cursoId={cursoId}`;

    public urlGetModulos = `${this.UrlServiceV1}ava/curso/getModulos.php?User={UserId}&cursoId={cursoId}`;
    public urlGetLastVideo = `${this.UrlServiceV1}ava/aula/getLastVideoView.php?User={UserId}&Curso={CursoId}&Modulo={AulaId}`;
    public urlPostMarkView = `${this.UrlServiceV1}ava/aula/postVideoView.php`;
    public urlPostFinishLesson= `${this.UrlServiceV1}ava/aula/postAulaFinish.php`;

    public urlPostBuyCourse = `${this.UrlServiceV1}ava/pagamento/buy.php`;



    //url metodo get
    
    public urlGetCertificados = `${this.UrlServiceV1}ava/certificado/getCertificado.php?User={UserId}`;
    
    

    //ava
    
    public urlGetAulaView = `${this.UrlServiceV1}ava/aula/getAulaView.php?User={UserId}&Curso={CursoId}&Modulo={ModuloId}`;
    

    
    

    //avp
    public urlGetCursosAvp = `${this.UrlServiceV1}avp/curso/getCursos.php?User={UserId}&Curso={CursoId}`;
    public urlPostCursosAvp = `${this.UrlServiceV1}avp/curso/postCurso.php`;
    public urlPostModulosAvp = `${this.UrlServiceV1}avp/curso/postModulo.php`;
    public urlPostAulasAvp = `${this.UrlServiceV1}avp/curso/postAula.php`;
    public urlDeleteModulo= `${this.UrlServiceV1}avp/curso/deleteModulo.php?User={UserId}&Curso={CursoId}&Modulo={ModuloId}`;
    public urlDeleteAula= `${this.UrlServiceV1}avp/curso/deleteAula.php?User={UserId}&Aula={AulaId}&Modulo={ModuloId}`;
    public urlUpdateInfo = `${this.UrlServiceV1}avp/curso/uptadeInfo.php`;
    public urlInativeCursosAvp = `${this.UrlServiceV1}avp/curso/inactiveCourse.php?User={UserId}&Curso={CursoId}`;



    //landing
    public urlGetCursos = `${this.UrlServiceV1}landing/curso/getCursos.php`;//ok
    public urlGetPreview = `${this.UrlServiceV1}/landing/curso/getCursos.php?Curso={IdCurso}`;

    //auth
    protected UrlServiceLoginV1: string = environment.apiUrlLoginv1;
    protected UrlServiceRecoveryv1: string = environment.apiUrlRecoveryv1;

    //Toda vez que chamar esse método, já irá retornar o header
    protected ObterHeaderJson(){
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
    }

    protected ObterHeaderUnlercoded(){
        return {
            headers: new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded'
            })
        }
    }

    protected ObterAuthHeaderJson(){
        return{
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.LocalStorage.obterTokenUsuario()
            })
        }

    }

    protected extractData(response: any){
          return response || {};
    }

    protected serviceError(response: Response | any) {

        let CustomError: string[] = [];

        if (response instanceof HttpErrorResponse) {

            if (response.statusText === "Unknown Error") {
                //CustomError.push("Ocorreu um erro desconhecido");
                //response.error.errors = CustomError;

                return throwError(() => 'Falha na comunicação - tente novamente mais tarde')
            }
            else if (response.status === 400) {
                CustomError.push("Erros de validação");
               // response.error.errors = CustomError;
            }
            else if (response.status === 401) {
                return throwError(() => '401 - Sem autorização')
            }
            else if (response.status === 403) {
                return throwError(() => '403 - Sem autorização')
            }
            else if (response.status === 403) {
                return throwError(() => '409 - Usuário já Existe')
            }
        }

        //console.error(response.error);
        return throwError(() => response);
    }

}
