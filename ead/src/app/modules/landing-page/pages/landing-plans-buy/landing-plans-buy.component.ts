import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FormRegisterComponent } from "../../../../shared/components/forms/form-register/form-register.component";


@Component({
  selector: 'app-landing-plans-buy',
  standalone: true,
  imports: [CommonModule, NzStepsModule, FormRegisterComponent],
  templateUrl: './landing-plans-buy.component.html',
  styleUrl: './landing-plans-buy.component.scss'
})
export class LandingPlansBuyComponent {
  @ViewChild(FormRegisterComponent) formRegister!: FormRegisterComponent;


  urlImgHeader: string = '/images/assets/header-plan.png';
  urlAbout: string = '/images/assets/about.jpg';
  urlImgHero: string = '';

  current:number = 0;

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    
     if (this.current === 0) {
        const registerOk = this.formRegister.registerUser();

        if (!registerOk) {
          return;
        }
     }

     this.current += 1;
  }

  done(): void {
    console.log('done');
  }
}
