import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/services/base.service';
import { FinancialDashboardSummaryDto, FinancialClosingSimulationDto } from '../models/financial.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService extends BaseService {

  constructor(injector: Injector, private httpClient: HttpClient) {
    super(injector);
  }

  getDashboardSummary(): Observable<FinancialDashboardSummaryDto> {
    const url = `${this.urlApiTheos}FinancialClosings/Summary`;
    return this.httpClient.get<FinancialDashboardSummaryDto>(url, this.GetAuthHeaderJson());
  }

  simulateClosing(): Observable<FinancialClosingSimulationDto> {
    const url = `${this.urlApiTheos}FinancialClosings/Simulate`;
    return this.httpClient.get<FinancialClosingSimulationDto>(url, this.GetAuthHeaderJson());
  }

  processClosing(teacherId: number): Observable<any> {
    const url = `${this.urlApiTheos}FinancialClosings`;
    return this.httpClient.post(url, { teacherId }, this.GetAuthHeaderJson());
  }
}
