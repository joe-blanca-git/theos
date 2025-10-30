import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface States {
  id: number;
  sigla: string;
  nome: string;
}

export interface Cities {
  id: number;
  nome: string;
  municipio?: {
    id?: number
  }
}

export interface Cep {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: string;
  ibge?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  async getStates(): Promise<States[]> {
    const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
    return firstValueFrom(this.httpClient.get<States[]>(url));
  }

  async getCities(uf: string): Promise<Cities[]> {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`;
    return firstValueFrom(this.httpClient.get<Cities[]>(url));

  }

  async getCep(cep: string): Promise<Cep>{
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    return firstValueFrom(this.httpClient.get<Cep>(url));
  }
}
