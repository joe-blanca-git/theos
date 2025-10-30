import { Component } from '@angular/core';
import { avpService } from '../services/avp.service';
import { cursosModel } from '../models/cursosModel';
import { error } from 'jquery';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avp-cursos',
  templateUrl: './avp-cursos.component.html',
  styleUrls: ['./avp-cursos.component.css'],
})
export class AvpCursosComponent {
  public listCursos: cursosModel[] = [];

  visibleNovoCurso: boolean = false;

  constructor(
    public avpService: avpService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCursos();
  }

  redirectToRoute(idCourse: number): void {
    this.router.navigate(['avp/avp-curso-detail'], { queryParams: { Curso: idCourse } });
  }
  
  getCursos() {
    this.avpService.getCursos(null)?.subscribe({
      next: (v: cursosModel[]) => {
        this.listCursos = v.map((item: any) => {
          const curso = new cursosModel().mapFromApi(item);
  
          if (curso.DataInc) {
            const date = new Date(curso.DataInc);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            curso.DataInc = `${day}/${month}/${year}`;
          }
  
          return curso;
        });
    
      },
      error: (e: any) => console.error(e),
      complete: () => {
       // console.log('complete');
      },
    });
  }

  inactiveCourse(idCourse: number){
    if (idCourse) {
      this.avpService.inactiveCourse(idCourse).subscribe({
        next:(res) => {
          this.notification.createBasicNotification('success', 'bg-success', 'text-light', res.message);
        },error:(err) => {
          this.notification.createBasicNotification('error', 'bg-danger', 'text-light', err.error);
        },complete: () => {
          this.getCursos();
        }
      })
    }
  }
  
  showNovoCurso() {
    this.visibleNovoCurso = true;
  }

  hiddeNovoCurso(event: boolean) {
    this.visibleNovoCurso = event;
  }
}
