import { Component } from '@angular/core';
import { LandingFooterComponent } from "../../shared/layouts/landing-footer/landing-footer.component";

@Component({
  selector: 'app-landing-about-us',
  standalone: true,
  imports: [LandingFooterComponent],
  templateUrl: './landing-about-us.component.html',
  styleUrl: './landing-about-us.component.scss'
})
export class LandingAboutUsComponent {
  urlImgHeader: string = '/images/assets/header-about.png';
  urlAbout: string = '/images/assets/about.jpg'
  urlImgHero: string = '';
}
