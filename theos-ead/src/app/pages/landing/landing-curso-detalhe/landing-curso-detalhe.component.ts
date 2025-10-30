import { Component, OnInit, AfterViewInit,HostListener  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { landingService } from '../services/landing.service';
import { cursosLandingModel } from '../models/curso-landing.model';


@Component({
  selector: 'app-landing-curso-detalhe',
  templateUrl: './landing-curso-detalhe.component.html',
  styleUrls: ['./landing-curso-detalhe.component.css',
              '../landing-cursos/landing-cursos.component.scss',
              '../landing-page/landing-page.component.css', 
              '../landing-page/landing-page.bootstrap.css',
              '../../avp/avp-cursos/avp-cursos.component.css'
  ]
})
export class LandingCursoDetalheComponent implements OnInit, AfterViewInit {
  cursoId: number | null = null;
  cursoSelecionado: any = null;
  loading: boolean = false;
  currentIndex = 0;
  idCurso: any = '';
  urlImgCurso: string = '';
  listAulas: any = [];

  cards = [
    {
      Id: 1,
      AulaId: 1,
      imgSrc: '../../../../assets/img/aulas/1.png',
    },
    {
      Id: 2,
      AulaId: 2,
      imgSrc: '../../../../assets/img/aulas/2.png',
    },
    {
      Id: 3,
      AulaId: 3,
      imgSrc: '../../../../assets/img/aulas/3.png',
    },
    {
      Id: 4,
      AulaId: 4,
      imgSrc: '../../../../assets/img/aulas/4.png',
    },
    {
      Id: 5,
      AulaId: 5,
      imgSrc: '../../../../assets/img/aulas/5.png',
    },
    {
      Id: 6,
      AulaId: 6,
      imgSrc: '../../../../assets/img/aulas/6.png',
    },
    {
      Id: 7,
      AulaId: 7,
      imgSrc: '../../../../assets/img/aulas/7.png',
    },
    {
      Id: 8,
      AulaId: 8,
      imgSrc: '../../../../assets/img/aulas/8.png',
    }
    ,
    {
      Id: 9,
      AulaId: 9,
      imgSrc: '../../../../assets/img/aulas/9.png',
    }
  ];
    
  private index: number = 0;
  private slideWidth: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private _landingService: landingService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    
    this.route.queryParams.subscribe((queryParams) => {
      const curso = queryParams['curso'];
      if (curso !== undefined) {
        this.obtemUrlCurso(curso);
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  obtemUrlCurso(id: number) {
    this._landingService.getPreview(id)
      .then(
        data =>{
          this.listAulas = data.map((item: any) => new cursosLandingModel().mapFromApi(item));
          const filteredAulas = this.listAulas.filter((entry: cursosLandingModel) => entry.Status =='A');
          this.listAulas = filteredAulas;        
          console.log(this.listAulas);
        }
      )    
  }

  ngAfterViewInit(): void {
    const slide = document.querySelector('.carousel-slide') as HTMLElement;
    if (slide) {
      this.slideWidth = slide.offsetWidth;
    }
  }

  nextSlide(): void {
    const totalSlides = this.cards.length;
    const slidesToShow = window.innerWidth <= 768 ? 1 : 4;
    if (this.currentIndex < totalSlides - slidesToShow) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateSlidePosition();
  }

  prevSlide(): void {
    const totalSlides = this.cards.length;
    const slidesToShow = window.innerWidth <= 768 ? 1 : 4;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = totalSlides - slidesToShow;
    }
    this.updateSlidePosition();
  }

  updateSlidePosition(): void {
    const slides = document.querySelectorAll('.carousel-slide');
    const container = document.querySelector('.carousel-container') as HTMLElement | null;
    if (container && slides.length > 0) {
      const slideWidth = slides[0].clientWidth;
      container.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateSlidePosition();
  }

  toggleMenu(): void {
    const navCollapse = document.getElementById('navbarNavDropdown');
    if (navCollapse?.classList.contains('show')) {
      navCollapse.classList.remove('show');
    } else {
      navCollapse?.classList.add('show');
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
}
