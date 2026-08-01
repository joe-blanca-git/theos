import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { BaseService } from '../../../../core/services/base.service';
import { SupportTicket, ForumTopic, UserAccess, MOCK_TICKETS, MOCK_TOPICS, MOCK_USERS_ACCESS } from './support.mocks';

export type { ForumTopic, ForumMessage, UserAccess, PurchasedCourse } from './support.mocks';

export interface IPaginatedList<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  totalPages: number;
}

export interface IAdminTicket {
  id: number;
  subject: string;
  categoryName: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface IAdminTicketDetails extends IAdminTicket {
  messages: IAdminTicketMessage[];
}

export interface IAdminTicketMessage {
  id: number;
  content: string;
  origin: string; // 'Portal', 'Backoffice', 'Email'
  createdAt: string;
  senderName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService {
  
  // Mock Data reference for stateful updates
  private mockTickets = MOCK_TICKETS;
  private mockTopics = MOCK_TOPICS;
  private mockUsersAccess = MOCK_USERS_ACCESS;

  constructor(protected override injector: Injector, private http: HttpClient) {
    super(injector);
  }

  // --- TICKETS (CHAMADOS) ---

  getTickets(status?: string, categoryId?: number, searchText?: string, pageIndex: number = 1, pageSize: number = 50): Observable<IPaginatedList<IAdminTicket>> {
    let url = `${this.urlApiTheos}tickets?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (status) url += `&status=${status}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (searchText) url += `&searchText=${searchText}`;
    
    return this.http.get<IPaginatedList<IAdminTicket>>(url, this.GetAuthHeaderJson());
  }

  getTicketById(id: number): Observable<IAdminTicketDetails> {
    return this.http.get<IAdminTicketDetails>(`${this.urlApiTheos}tickets/${id}`, this.GetAuthHeaderJson());
  }

  replyTicket(id: number, content: string): Observable<{ messageId: number }> {
    const payload = { ticketId: id, content, attachments: [] };
    return this.http.post<{ messageId: number }>(`${this.urlApiTheos}tickets/${id}/messages`, payload, this.GetAuthHeaderJson());
  }

  updateTicketStatus(id: number, status: string): Observable<any> {
    const payload = { ticketId: id, status: parseInt(status) };
    return this.http.put(`${this.urlApiTheos}tickets/${id}/status`, payload, this.GetAuthHeaderJson());
  }

  // --- FORUM TOPICS ---

  getForumTopics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApiTheos}support-forum`, this.GetAuthHeaderJson());
  }

  getForumTopicById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApiTheos}support-forum/${id}`, this.GetAuthHeaderJson());
  }

  replyForumTopic(id: number, content: string): Observable<any> {
    const payload = { content };
    // The backend returns { id: resultId }
    return this.http.post<any>(`${this.urlApiTheos}support-forum/${id}/reply`, payload, this.GetAuthHeaderJson());
  }

  updateForumTopicStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.urlApiTheos}support-forum/${id}/status`, { status }, this.GetAuthHeaderJson());
  }

  // --- USER ACCESS ---

  getUsersAccess(): Observable<UserAccess[]> {
    return this.http.get<UserAccess[]>(`${this.urlApiTheos}support-access`, this.GetAuthHeaderJson()).pipe(
      catchError(() => of(this.mockUsersAccess).pipe(delay(600)))
    );
  }

  grantCourseAccess(userId: number, courseId: number): Observable<UserAccess> {
    return this.http.post<UserAccess>(`${this.urlApiTheos}support-access/${userId}/grant/${courseId}`, {}, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const user = this.mockUsersAccess.find(u => u.id === userId);
        if (user) {
          const course = user.courses.find(c => c.id === courseId);
          if (course) {
            course.accessStatus = 'Liberado';
          }
        }
        return of(user!).pipe(delay(600));
      })
    );
  }
}
