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

export interface ISupportTicket {
  id: number;
  subject: string;
  categoryName: string;
  status: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface ISupportTicketDetails extends ISupportTicket {
  messages: ITicketMessage[];
}

export interface ITicketMessage {
  id: number;
  content: string;
  origin: string; // 'Portal', 'Backoffice', 'Email'
  createdAt: string;
  senderName?: string;
}

export interface IPaginatedList<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  totalPages: number;
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

  getTickets(status?: string, categoryId?: number, searchText?: string, pageIndex: number = 1, pageSize: number = 20): Observable<IPaginatedList<ISupportTicket>> {
    let url = `api/v1/portal/tickets?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (searchText) url += `&searchText=${searchText}`;
    
    return this.get<IPaginatedList<ISupportTicket>>(url);
  }

  getTicketDetails(id: number): Observable<ISupportTicketDetails> {
    return this.get<ISupportTicketDetails>(`api/v1/portal/tickets/${id}`);
  }

  replyTicket(id: number, content: string): Observable<{ messageId: number }> {
    return this.post<{ messageId: number }>(`api/v1/portal/tickets/${id}/messages`, {
      ticketId: id,
      content: content,
      attachments: []
    });
  }
}
