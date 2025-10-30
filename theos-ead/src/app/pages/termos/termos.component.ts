import { Component } from '@angular/core';

@Component({
  selector: 'app-termos',
  templateUrl: './termos.component.html',
  styleUrls: ['./termos.component.css']
})
export class TermosComponent {
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
