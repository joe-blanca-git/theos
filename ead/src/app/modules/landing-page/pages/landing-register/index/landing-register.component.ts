import { Component } from '@angular/core';
import { FormRegisterComponent } from '../../../../../shared/components/forms/form-register/form-register.component';

@Component({
  selector: 'app-landing-register',
  standalone: true,
  imports: [FormRegisterComponent],
  templateUrl: './landing-register.component.html',
  styleUrl: './landing-register.component.scss',
})
export class LandingRegisterComponent {
  urlImgHeader: string = '/images/assets/header-plan.png';
  urlAbout: string = '/images/assets/about.jpg';
  urlImgHero: string = '';

  current: number = 0;
}
