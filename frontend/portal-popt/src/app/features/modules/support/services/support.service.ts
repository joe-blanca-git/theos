import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { BaseService } from '../../../../core/services/base.service';
import { SupportTicket, ForumTopic, UserAccess, MOCK_TICKETS, MOCK_TOPICS, MOCK_USERS_ACCESS } from './support.mocks';

export type { SupportTicket, TicketMessage, ForumTopic, ForumMessage, UserAccess, PurchasedCourse } from './support.mocks';

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

  getTickets(): Observable<SupportTicket[]> {
    return this.http.get<SupportTicket[]>(`${this.urlApiTheos}support-tickets`, this.GetAuthHeaderJson()).pipe(
      catchError(() => of(this.mockTickets).pipe(delay(600)))
    );
  }

  getTicketById(id: number): Observable<SupportTicket> {
    return this.http.get<SupportTicket>(`${this.urlApiTheos}support-tickets/${id}`, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const ticket = this.mockTickets.find(t => t.id === id);
        return ticket ? of(ticket).pipe(delay(300)) : throwError(() => new Error('Not found'));
      })
    );
  }

  replyTicket(id: number, content: string): Observable<SupportTicket> {
    const payload = { content };
    return this.http.post<SupportTicket>(`${this.urlApiTheos}support-tickets/${id}/reply`, payload, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const ticket = this.mockTickets.find(t => t.id === id);
        if (ticket) {
          ticket.messages.push({
            id: Date.now(),
            sender: 'Support',
            senderName: 'Analista de Suporte',
            content,
            createdAt: new Date().toISOString()
          });
          ticket.status = 'Respondido';
        }
        return of(ticket!).pipe(delay(600));
      })
    );
  }

  updateTicketStatus(id: number, status: 'Pendente' | 'Respondido' | 'Cancelado' | 'Finalizado'): Observable<any> {
    return this.http.patch(`${this.urlApiTheos}support-tickets/${id}/status`, { status }, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const ticket = this.mockTickets.find(t => t.id === id);
        if (ticket) ticket.status = status;
        return of({ success: true }).pipe(delay(400));
      })
    );
  }

  // --- FORUM TOPICS ---

  getForumTopics(): Observable<ForumTopic[]> {
    return this.http.get<ForumTopic[]>(`${this.urlApiTheos}support-forum`, this.GetAuthHeaderJson()).pipe(
      catchError(() => of(this.mockTopics).pipe(delay(600)))
    );
  }

  getForumTopicById(id: number): Observable<ForumTopic> {
    return this.http.get<ForumTopic>(`${this.urlApiTheos}support-forum/${id}`, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const topic = this.mockTopics.find(t => t.id === id);
        return topic ? of(topic).pipe(delay(300)) : throwError(() => new Error('Not found'));
      })
    );
  }

  replyForumTopic(id: number, content: string): Observable<ForumTopic> {
    const payload = { content };
    return this.http.post<ForumTopic>(`${this.urlApiTheos}support-forum/${id}/reply`, payload, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const topic = this.mockTopics.find(t => t.id === id);
        if (topic) {
          topic.messages.push({
            id: Date.now(),
            sender: 'Support',
            senderName: 'Analista de Suporte',
            content,
            createdAt: new Date().toISOString()
          });
          topic.replyCount++;
          topic.status = 'Em atendimento';
        }
        return of(topic!).pipe(delay(600));
      })
    );
  }

  updateForumTopicStatus(id: number, status: 'Aguardando resposta' | 'Em atendimento' | 'Finalizado'): Observable<any> {
    return this.http.patch(`${this.urlApiTheos}support-forum/${id}/status`, { status }, this.GetAuthHeaderJson()).pipe(
      catchError(() => {
        const topic = this.mockTopics.find(t => t.id === id);
        if (topic) topic.status = status;
        return of({ success: true }).pipe(delay(400));
      })
    );
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
