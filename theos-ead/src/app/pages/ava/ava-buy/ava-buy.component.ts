import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { buyService } from './services/ava.buy.service';
import { cursosModel } from '../models/cursosModel';
import { avaService } from '../services/ava.service';

@Component({
  selector: 'app-ava-buy',
  templateUrl: './ava-buy.component.html',
  styleUrls: ['./ava-buy.component.css'],
})
export class AvaBuyComponent {
  idCurso: any;
  idUser:any;
  dadosCurso: any = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _buyService: buyService,
    private _avaServive: avaService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.idCurso = queryParams['curso'];
    });

    const userJson = localStorage.getItem('THEOS.ava.user');

    const user = JSON.parse(userJson || '');
    this.idUser = user.id;

    this.getCursos();
  }

  getCursos() {
    this.route.queryParams.subscribe((params) => {
      let categoria = params['categoria'];

      if (categoria === 'pregacao') {
        categoria = 1;
      }

      this._avaServive.getCursos(categoria, this.idCurso).then((data) => {
        this.dadosCurso = data.map((item: any) =>
          new cursosModel().mapFromApi(item)
        );
        const fileteredCursos = this.dadosCurso.filter(
          (entry: cursosModel) => entry.Status == 'A'
        );
        this.dadosCurso = fileteredCursos;
      });
    });
  }

  formatarParaBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarData(dataTexto: string): string {
    const data = new Date(dataTexto);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  postCompraCurso() {
    return new Promise((resolve, reject) => {
      const json = {
        Curso: this.idCurso,
      };
      this._buyService
        .postBuyCourse(json)
        .then((response) => {
          resolve(response);
          this.router.navigate(['ava/ava-cursos']);
        })
        .catch((error) => {
          console.error('Erro ao comprar curso:', error);
          reject(error);
        });
    });
  }
  
}
