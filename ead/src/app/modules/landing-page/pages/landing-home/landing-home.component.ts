import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-home',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.scss'
})
export class LandingHomeComponent {
  urlImgIco: string = ''
  urlImgHeader: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724259645/header_earf0j.png';
  urlSobre: string = 'https://i.imgur.com/rH7GYbu.gif';
  urlProfessores: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261470/LandingPage/0SZgnKD_-_Imgur_pfgp1v.jpg';
  urlInstitucional: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261490/LandingPage/mVMcBzd_-_Imgur_glhroe.jpg';
  urlVideoMiniatura: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724261400/LandingPage/d8RjvWG_-_Imgur_okxh5j.jpg';

  imgHeaderSize = 200;
  isVisible = false;

  ngOnInit(): void {
    this.handleResponsiveLayout();
  }

    handleResponsiveLayout() {
    const width = window.innerWidth;

    if (width <= 767) {
      //Celulares
      this.imgHeaderSize = 90;
      this.isVisible = false;
    } else if (width >= 768 && width <= 820) {
      // Tablets
      this.imgHeaderSize = 100;
      this.isVisible = false;

    } else if (width >= 821 && width <= 1024) {
      // Tablets
      this.imgHeaderSize = 150;
      this.isVisible = true;
      
    } else if (width >= 1025 && width <= 1440) {
      // Computadores
      this.imgHeaderSize = 200;
      this.isVisible = true;
      
    } else {
      // Telas grandes
      this.imgHeaderSize = 200;
      this.isVisible = true;
      
    }
  }
}
