import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ITicketCategory {
  id: number;
  description: string;
}

export interface ICreateTicketRequest {
  subject: string;
  categoryId: number;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCategories(): Observable<ITicketCategory[]> {
    return this.get<ITicketCategory[]>('api/v1/portal/ticket-categories');
  }

  createTicket(data: ICreateTicketRequest): Observable<{ ticketId: number }> {
    return this.post<{ ticketId: number }>('api/v1/portal/tickets', data);
  }
}
