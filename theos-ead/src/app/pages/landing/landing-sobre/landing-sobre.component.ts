import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-sobre',
  templateUrl: './landing-sobre.component.html',
  styleUrls: ['./landing-sobre.component.css',
              '../landing-page/landing-page.component.css', 
              '../landing-page/landing-page.bootstrap.css'
  ]
})
export class LandingSobreComponent {

  urlImgHeader: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724350180/Header/birthday_fw1xkh.png';
  loading: boolean = false;
  private scripts: HTMLScriptElement[] = [];

  ngOnInit(): void {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 1000);

  }
}
