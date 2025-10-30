import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  formatarData(data: string): string {
    if (!data) return 'Data inválida';

    const date = moment(data, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss'], true);

    if (!date.isValid()) return 'Data inválida'; 

    return date.format('DD/MM'); 
  }
}
