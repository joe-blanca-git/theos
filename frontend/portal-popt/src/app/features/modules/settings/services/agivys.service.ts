import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/services/base.service';

export interface AgivysRole {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgivysService extends BaseService {
  
  // Base URL for the Agivys RLS API
  private readonly agivysRlsUrl = 'https://joederblanca.com.br/agivys-api/api/v1/RLS';

  constructor(protected override injector: Injector, private http: HttpClient) {
    super(injector);
  }

  getRoles(): Observable<AgivysRole[]> {
    return this.http.get<AgivysRole[]>(`${this.agivysRlsUrl}/getRoles`, this.GetAuthHeaderJson());
  }

  assignRole(userId: number, roleName: string): Observable<any> {
    const payload = { userId, roleName };
    const options: any = this.GetAuthHeaderJson();
    options.responseType = 'text';
    return this.http.post(`${this.agivysRlsUrl}/postAssignRole`, payload, options);
  }

  removeRole(userId: number, roleName: string): Observable<any> {
    const payload = { userId, roleName };
    const options: any = this.GetAuthHeaderJson();
    options.body = payload;
    options.responseType = 'text';
    return this.http.delete(`${this.agivysRlsUrl}/removeRole`, options);
  }
}
