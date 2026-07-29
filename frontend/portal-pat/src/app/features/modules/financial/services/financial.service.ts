import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/services/base.service';

export interface PixRequest {
  cursoId: number;
  cpf: string;
  holderName?: string;
  valor: number;
  tipoCompra: string;
}

export interface PixResponse {
  sucesso: boolean;
  purchaseId?: number;
  cobrancaId: string;
  pixCopiaECola: string;
  qrCode: string;
}
export interface PendenciaDTO {
  temPendencia: boolean;
  purchaseId?: number;
  status: string;
  metodoPagamento: string;
  pixCopiaECola?: string;
  qrCodeBase64?: string;
  mensagem?: string;
  jaPago?: boolean;
}

// Essa interface pode ser mantida aqui para tipar o que vem do CoursesService
export interface CheckoutSummary {
  id: number;
  title: string;
  imgCoverLink: string;
  priceSingle: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService extends BaseService {
  constructor(injector: Injector, private http: HttpClient) {
    super(injector);
  }

  gerarPixAsaas(payload: PixRequest): Observable<PixResponse> {
    return this.http.post<PixResponse>(`${this.urlApiTheos}financeiro/checkout/pix`, payload, this.GetAuthHeaderJson());
  }

  checkoutCard(payload: any): Observable<any> {
    return this.http.post<any>(`${this.urlApiTheos}financeiro/checkout/card`, payload, this.GetAuthHeaderJson());
  }

  verificarPendencias(cursoId: number | undefined): Observable<PendenciaDTO> {
    if (!cursoId) {
      throw new Error('CursoId é obrigatório para verificar pendências.');
    }
    const url = `${this.urlApiTheos}financeiro/checkout/pendencias?cursoId=${cursoId}&tipoCompra=AVULSO`;
    return this.http.get<PendenciaDTO>(url, this.GetAuthHeaderJson());
  }

  cancelPurchase(purchaseId: number): Observable<any> {
    return this.http.post(`${this.urlApiTheos}purchases/${purchaseId}/cancel`, {}, this.GetAuthHeaderJson());
  }

  getMyPortalTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApiTheos}portal/financial/transactions`, this.GetAuthHeaderJson());
  }

  getApiUrl(): string {
    return this.urlApiTheos;
  }
}
