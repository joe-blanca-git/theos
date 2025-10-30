import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValorFormatterService {

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
