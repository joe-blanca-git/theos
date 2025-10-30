
import { Component, OnInit } from '@angular/core';
import { createClient } from 'pexels';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css',
              './landin-page-caroussel.scss', 
              './landing-page.bootstrap.css',]
})
export class LandingPageComponent implements OnInit {
  loading: boolean = false;
  currentSection: string = 'header';

  urlImgIco: string = ''
  urlImgHeader: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724259645/header_earf0j.png';
  urlSobre: string = 'https://i.imgur.com/rH7GYbu.gif';
  urlProfessores: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261470/LandingPage/0SZgnKD_-_Imgur_pfgp1v.jpg';
  urlInstitucional: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261490/LandingPage/mVMcBzd_-_Imgur_glhroe.jpg';
  urlVideoMiniatura: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261400/LandingPage/d8RjvWG_-_Imgur_okxh5j.jpg';

  urlAtual: string = '';

  client = createClient('nsnDs19aENJEGQn6hR9nDr6NxocOKvpmlXkUwmcjF0lFtPIcKYlVfgxr');

  apiKeyPexel: string = 'nsnDs19aENJEGQn6hR9nDr6NxocOKvpmlXkUwmcjF0lFtPIcKYlVfgxr';

  imgSlides: any = [
    {
      Id: 1,
      urlImgSlide: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261586/LandingPage/1_ylagai.png'
    },
    {
      Id: 2,
      urlImgSlide: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261604/LandingPage/2_kqinnc.png'
    },
    {
      Id: 3,
      urlImgSlide: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261708/LandingPage/3_fnlq4m.png'
    }
  ];

  cursos:any = [
    {
      nome: 'Ide e Pregaoi o Evangelho',
      urlImg: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261798/LandingPage/undefined_-_Imgur_bxl8kf.jpg',
      link:''
    },
    {
      nome: 'Horizontes da Fé',
      urlImg: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724759477/1_pp9vye.png',
      link:''
    }
  ];

  igrejasParceiras: any = [
    {
      urlImg: 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261814/LandingPage/B9bRNhw_-_Imgur_x3zo2h.png'
    }
  ];

  url_teste = '';

  constructor(public sanitizer: DomSanitizer) {
    
  }


  ngOnInit(): void {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 1000);

    const sections = document.querySelectorAll('section');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentSection = id; 
    }
  }

  cadastrarEmail(){

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
