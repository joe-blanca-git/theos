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
    this.usuario.id = response.user.id;
    this.usuario.username = response.user.email;
    this.usuario.claims = response.user.roles;
    this.usuario.courses = response.user.courses;

    localStorage.setItem('THEOS.user', JSON.stringify(this.usuario));
  }

  public obterTipoDeUsuario(): string | null {
    const stored = localStorage.getItem('THEOS.user');

    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored);

      const roles = parsed?.claims;
      
      if (!Array.isArray(roles)) {
        return null;
      }

      const role = roles.find((r: any) => r.Name === 'user_type');

      return role?.Value ?? null;
    } catch {
      return null;
    }
  }

  public obterTokenUsuario(): string {
    return localStorage.getItem('THEOS.token') ?? '';
  }

  public verifyToken(): boolean {
    const token = this.obterTokenUsuario();

    if (!token) {
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return false;
      }

      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      if (!payload.exp) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);

      if (now >= payload.exp) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}
