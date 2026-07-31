import { Injectable, Injector } from '@angular/core';
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
  constructor(protected override injector: Injector, private http: HttpClient) {
    super(injector);
  }

  getCategories(): Observable<ITicketCategory[]> {
    return this.http.get<ITicketCategory[]>(`${this.urlApiTheos}ticket-categories`, this.GetAuthHeaderJson());
  }

  createTicket(data: ICreateTicketRequest): Observable<{ ticketId: number }> {
    return this.http.post<{ ticketId: number }>(`${this.urlApiTheos}tickets`, data, this.GetAuthHeaderJson());
  }

  getTickets(status?: string, categoryId?: number, searchText?: string, pageIndex: number = 1, pageSize: number = 20): Observable<IPaginatedList<ISupportTicket>> {
    let url = `${this.urlApiTheos}tickets?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (searchText) url += `&searchText=${searchText}`;
    
    return this.http.get<IPaginatedList<ISupportTicket>>(url, this.GetAuthHeaderJson());
  }

  getTicketDetails(id: number): Observable<ISupportTicketDetails> {
    return this.http.get<ISupportTicketDetails>(`${this.urlApiTheos}tickets/${id}`, this.GetAuthHeaderJson());
  }

  replyTicket(id: number, content: string): Observable<{ messageId: number }> {
    return this.http.post<{ messageId: number }>(`${this.urlApiTheos}tickets/${id}/messages`, {
      ticketId: id,
      content: content,
      attachments: []
    }, this.GetAuthHeaderJson());
  }
}
