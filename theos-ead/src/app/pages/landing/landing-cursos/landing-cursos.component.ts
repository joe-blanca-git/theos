import { Component, OnInit, OnDestroy,} from '@angular/core';
import { Router } from '@angular/router';
import { cursosLandingModel } from 'src/app/pages/landing/models/curso-landing.model';
import { landingService } from '../services/landing.service';
import { color } from '@cloudinary/url-gen/qualifiers/background';


@Component({
  selector: 'app-landing-cursos',
  templateUrl: './landing-cursos.component.html',
  styleUrls: ['./landing-cursos.component.css',
              './landing-cursos.component.scss',
              '../landing-page/landing-page.component.css', 
              '../landing-page/landing-page.bootstrap.css']
})
export class LandingCursosComponent implements OnInit{
  loading: boolean = false;
  isMovedUp: boolean = false;
  isCardMovedUp: boolean[] = [];
  qtdeAlunos:number = 0;
  currentSection: string = 'header';

  listCursos: any[] = [];

  
  constructor(
    private _router: Router,
    private _landingService: landingService
  ) {
    this.isCardMovedUp = this.listCursos.map(() => false);
  }


  compartilhar(id: number): void{
    console.log(id);
  }

  comentar(id: number): void{
    console.log(id);
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCursos();
    //this.loading = false;

    setTimeout(() => {
      this.loading = false;
    }, 1000);

  }

  getCursos(){
    this._landingService.getCursos()
      .then(
        data =>{       
          this.listCursos = data.map((item: any) => new cursosLandingModel().mapFromApi(item));
          const filteredCursos = this.listCursos.filter((entry: cursosLandingModel) => entry.Status == 'A');
          if(filteredCursos){
            this.listCursos = filteredCursos;
          }
          console.log(filteredCursos);
          
        }
      )
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

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0')    ].join(':');
  }

  toggleMenu(): void {
    const navCollapse = document.getElementById('navbarNavDropdown');
    if (navCollapse?.classList.contains('show')) {
      navCollapse.classList.remove('show');
    } else {
      navCollapse?.classList.add('show');
    }
  }
}
