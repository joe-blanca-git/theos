import { Component } from '@angular/core';

@Component({
  selector: 'app-politica',
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.css']
})
export class PoliticaComponent {
  currentSection: string = 'header';
  urlImgIco: string = '';

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentSection = id; // Atualize a seção atual ao clicar no link
    }
  }
}
