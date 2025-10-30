import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-plans',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-plans.component.html',
  styleUrl: './landing-plans.component.scss',
})
export class LandingPlansComponent {
  urlImgHeader: string = '/images/assets/header-plan.png';
  urlAbout: string = '/images/assets/about.jpg';
  urlImgHero: string = '';

 signaturePlanItems: any[] = [
  { value: 'Acesso a todos os cursos!', icon: 'fa-solid fa-graduation-cap' },
  { value: 'Conteúdos exclusivos', icon: 'fa-solid fa-star' },
  { value: 'Certificados reconhecidos', icon: 'fa-solid fa-certificate' },
  { value: 'Aulas novas toda semana', icon: 'fa-solid fa-calendar-plus' },
  { value: 'Aprendizado no seu ritmo', icon: 'fa-solid fa-clock' },
  { value: 'Suporte direto com professores', icon: 'fa-solid fa-chalkboard-teacher' },
  { value: 'Download de materiais de apoio', icon: 'fa-solid fa-file-download' },
  { value: 'Acesso pelo celular, tablet ou computador', icon: 'fa-solid fa-laptop' },
  { value: 'Grupo exclusivo de alunos', icon: 'fa-solid fa-users' },
  { value: 'Teologia aplicada à vida real', icon: 'fa-solid fa-hands-praying' }
];

cursos: any = [
    {
      nome: 'Ide e Pregai o Evangelho',
      urlImg:
        'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261798/LandingPage/undefined_-_Imgur_bxl8kf.jpg',
      link: '',
      price: 99.99
    },
    {
      nome: 'Horizontes da Fé',
      urlImg:
        'https://res.cloudinary.com/dez4evjlq/image/upload/v1724759477/1_pp9vye.png',
      link: '',
      price: 49.90
    },
  ];

}
