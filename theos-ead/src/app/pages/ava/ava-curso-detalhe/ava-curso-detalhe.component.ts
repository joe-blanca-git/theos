import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { avaService } from '../../ava/services/ava.service';
import { cursosModel } from '../models/cursosModel';
import { ModulosModel } from '../models/cursoModulos.model';

@Component({
  selector: 'app-ava-curso-detalhe',
  templateUrl: './ava-curso-detalhe.component.html',
  styleUrls: ['./ava-curso-detalhe.component.css']
})
export class AvaCursoDetalheComponent {

  cursoId: number | null = null;
  cursoSelecionado: any = null;
  aulasConcluida: number = 0;
  forumCriado: number = 0;
  idCurso: any = '';
  urlImgCurso: string = '';
  questionarios: any = [
    {
      respondidos:0,
      pendentes: 0
    }
  ]

  dadosCurso:any[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private _avaServive: avaService,
  ) {}

  ngOnInit(): void {
    this.loadDados();
  };

  loadDados(){
    this.loading = true;

    try {
      this.getModulos();
    } catch (error) {
      
    }finally{
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }

  getModulos(){
    this.route.paramMap.subscribe((p) => {
      const cursoId = this.route.snapshot.queryParamMap.get('curso');

      if (cursoId) {
        this._avaServive.getModulos(cursoId)
        .then((data: any )=> {
          this.dadosCurso = data.map((i: any) => new ModulosModel().mapFromApi(i));
        })
      }

    })
  }

  countModulos(modulos: any[]): number {
    return modulos.filter(modulo => modulo.StatusConclusao === 'C').length;
  }

  calcularProgresso(modulos: any[]): number {
    if (!modulos || modulos.length === 0) return 0;
  
    const concluidos = modulos.filter(modulo => modulo.StatusConclusao === 'C').length;
    const total = modulos.length;
    return Math.round((concluidos / total) * 100);
  }
  
  
  
}
