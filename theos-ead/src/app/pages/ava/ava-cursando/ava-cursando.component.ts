import { Component } from '@angular/core';
import { avaService } from '../services/ava.service';
import { cursandoModel } from '../models/cursando.model';
import { cursosModel } from '../models/cursosModel';


@Component({
  selector: 'app-ava-cursando',
  templateUrl: './ava-cursando.component.html',
  styleUrls: ['./ava-cursando.component.css']
})
export class AvaCursandoComponent {
  listMeusCursos:cursosModel[] = [];
  collapseStates: boolean[] = [];
  loading: boolean = false;

  constructor(
    private _avaServive: avaService,
  ) {
    this.listMeusCursos.forEach(() => this.collapseStates.push(false));
  }

  ngOnInit(): void {
    this.loadDados();
  }

  async loadDados(){
    this.loading = true;

    try {
      await this.getCursando();
    } finally{
      this.loading = false;
    }
  }

  async getCursando() {
    await this._avaServive.getCursando()
      .then(data => {
        this.listMeusCursos = data.map((curso: any) => ({
          ...curso,
          Progresso: Math.min(100, Math.round((+curso.TotalHorasVisto / +curso.TotalHorasCurso) * 100))
        }));

        console.log(this.listMeusCursos);
        
      })
      .catch(error => console.error(error));
  }
  
  
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }

  toggleCollapse(index: number): void {
      this.collapseStates[index] = !this.collapseStates[index];
  }
}
