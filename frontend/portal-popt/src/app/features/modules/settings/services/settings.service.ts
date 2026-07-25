import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BaseService } from '../../../../core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {

  constructor(protected override injector: Injector, private http: HttpClient) {
    super(injector);
  }

  // --- Course Categories ---

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApiTheos}course-categories`, this.GetAuthHeaderJson());
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApiTheos}course-categories/${id}`, this.GetAuthHeaderJson());
  }

  createCategory(categoryData: { name: string, description?: string }): Observable<number> {
    return this.http.post<number>(`${this.urlApiTheos}course-categories`, categoryData, this.GetAuthHeaderJson());
  }

  updateCategory(id: number, categoryData: { id: number, name: string, description?: string }): Observable<any> {
    return this.http.put<any>(`${this.urlApiTheos}course-categories/${id}`, categoryData, this.GetAuthHeaderJson());
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApiTheos}course-categories/${id}`, this.GetAuthHeaderJson());
  }

  // --- Teachers ---

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApiTheos}Teachers`, this.GetAuthHeaderJson());
  }

  getTeacherById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApiTheos}Teachers/${id}`, this.GetAuthHeaderJson());
  }

  createTeacher(teacherData: any): Observable<number> {
    return this.http.post<number>(`${this.urlApiTheos}Teachers`, teacherData, this.GetAuthHeaderJson());
  }

  updateTeacher(id: number, teacherData: any): Observable<any> {
    return this.http.put<any>(`${this.urlApiTheos}Teachers/${id}`, teacherData, this.GetAuthHeaderJson());
  }

  deleteTeacher(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApiTheos}Teachers/${id}`, this.GetAuthHeaderJson());
  }

  getSystemUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApiTheos}Users`, this.GetAuthHeaderJson());
  }
}
