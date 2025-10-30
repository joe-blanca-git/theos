import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-painel-adm',
  templateUrl: './painel-adm.component.html',
  styleUrls: ['./painel-adm.component.css']
})
export class PainelAdmComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  cloudName: string = 'dez4evjlq';
  uploadPreset: string = 'ml_default';
  folderName: string = 'LandingPage';
  loading: boolean = false;

  urlAtual: string = '';

  folders: string[] = ['LandingPage', 'Login', 'Cadastro','Recuperar', 'Professores']; 

  images: string[] = ['Header', 'Sobre', 'Cadastro', 'Professores', 'Institucional', 'MiniaturaVideo', 'background']; 

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage(): void {
    this.loading = true;
    if (!this.selectedFile) {
      console.error('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.folderName); // Especifica a pasta selecionada

    this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData)
      .subscribe(
        (response: any) => {
           this.urlAtual = response.secure_url;
        },
        (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        }
      );

      this.loading = false;
  }
}
