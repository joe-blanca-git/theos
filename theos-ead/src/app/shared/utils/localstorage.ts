import { usuarioLogado } from "../models/usuariologado.model";

export class LocalStorageUtils {
  usuario: usuarioLogado = new usuarioLogado;

  public obterUsuario() {
    const userStr = localStorage.getItem('THEOS.ava.user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }


  public salvarDadosLocaisUsuario(response: any) {
    this.salvarTokenUsuario(response.access_token);
    this.salvarUsuario(response);
  }

  public limparDadosLocaisUsuario(){
    localStorage.removeItem('THEOS.ava.token');
    localStorage.removeItem('THEOS.ava.user');
  }

  public salvarTokenUsuario(token: string) {
    localStorage.setItem('THEOS.ava.token', token);
  }

  public salvarUsuario(response: any) {
    this.usuario.id = response.usuarioToken.codigo;
    this.usuario.username = response.usuarioToken.userName;
    this.usuario.claims = response.usuarioToken.claims;
    this.usuario.courses = response.usuarioToken.courses;

    localStorage.setItem('THEOS.ava.user', JSON.stringify(this.usuario));
  }

  public obterTokenUsuario(): string {
    return localStorage.getItem('THEOS.ava.token') ?? '';
  }


}

