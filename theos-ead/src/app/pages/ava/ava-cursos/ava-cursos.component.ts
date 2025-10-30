import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { avaService } from '../services/ava.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { cursosModel } from '../models/cursosModel';



@Component({
  selector: 'app-ava-cursos',
  templateUrl: './ava-cursos.component.html',
  styleUrls: ['./ava-cursos.component.css',
              '../../landing/landing-cursos/landing-cursos.component.css',
              '../../landing/landing-page/landing-page.component.css', 
              '../../landing/landing-page/landing-page.bootstrap.css'
  ]
})
export class AvaCursosComponent {
  loading: boolean = false;
  isMovedUp: boolean = false;
  isCardMovedUp: boolean[] = [];
  qtdeAlunos:number = 0;
  currentSection: string = 'header';
  listCursos: any[] = [ ];
  
  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _avaServive: avaService,
    private notification: NzNotificationService,   
  ) {
    this.isCardMovedUp = this.listCursos.map(() => false);
  }



  ngOnInit(): void {
    this.loadDados();
    //fazer load dados
    //fazer get de todos os cursos
    //fazer get dos cursos do aluno
    //mudar campo estudar ou comprar com base na lista
  }

  async loadDados(){
    this.loading = true;
    try {
      await this.getCursos();
    } catch (error) {
      console.error('Erro ao carregar cursos!');
    }finally{
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentSection = id;
    }
  }

  toggleMove(index: number, func:string): void {

    if(func === 'show'){
      this.isCardMovedUp[index] = !this.isCardMovedUp[index];
    }else if(func === 'comment'){
      console.log('chamou comentário, ', index)
    }else if(func === 'share'){
      console.log('chamou compartilhar ', index)
    }
    
  }

  getCursos(){
    this.route.queryParams.subscribe(params => {
      let categoria = params['categoria'];

      if (categoria === 'pregacao') {
        categoria = 5;
      }
      
      this._avaServive.getCursos(categoria, '')
      .then(
        data =>{
          
          
          this.listCursos = data.map((item: any) => new cursosModel().mapFromApi(item));
          const fileteredCursos = this.listCursos.filter((entry: cursosModel) => entry.Status == 'A');
          this.listCursos = fileteredCursos;
          console.log(this.listCursos);
        }
      )
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0')    ].join(':');
  }

  compartilhar(id: number): void{
    console.log(id);
  }

  comentar(id: number): void{
    console.log(id);
  }

}
