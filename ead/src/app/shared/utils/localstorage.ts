import { LoggedUsers } from '../models/loggedUser';

export class LocalStorageUtils {
  usuario: LoggedUsers = new LoggedUsers();

  public obterUsuario() {
    const userStr = localStorage.getItem('THEOS.user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  public salvarDadosLocaisUsuario(response: any) {
    this.salvarTokenUsuario(response.access_token);
    this.salvarUsuario(response);
  }

  public limparDadosLocaisUsuario() {
    localStorage.removeItem('THEOS.token');
    localStorage.removeItem('THEOS.user');
  }

  public salvarTokenUsuario(token: string) {
    localStorage.setItem('THEOS.token', token);
  }

  public salvarUsuario(response: any) {
    this.usuario.id = response.usuarioToken.codigo;
    this.usuario.username = response.usuarioToken.userName;
    this.usuario.claims = response.usuarioToken.claims;
    this.usuario.courses = response.usuarioToken.courses;

    localStorage.setItem('THEOS.user', JSON.stringify(this.usuario));
  }

  public obterTokenUsuario(): string {
    return localStorage.getItem('THEOS.token') ?? '';
  }
}
