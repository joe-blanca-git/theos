import { Component } from '@angular/core';
import { avaService } from '../../ava/services/ava.service';
import { totaisUserModel } from 'src/app/pages/ava/models/totaisUser.model';


@Component({
  selector: 'app-ava-home',
  templateUrl: './ava-home.component.html',
  styleUrls: ['./ava-home.component.css'],
})
export class AvaHomeComponent {
  cursando: number = 0;
  concluido: number = 0;
  tempoH: string = '00h';
  percentual: any = '';
  dadosTotais: any;
  categorias: any = [
    {
      Id: 1,
      title: 'Pregação',
      descricao:
        'Fundamentos sólidos para formar pregadores preparados e aprovados pelo Senhor.',
      imgUrl:
        'https://res.cloudinary.com/dez4evjlq/image/upload/v1724546096/LandingPage/1_umvlb2.gif',
      link: '../ava-cursos',
      categoria: 'pregacao',
    },
    // {
    //   Id: 1,
    //   title: 'Evangelismo',
    //   descricao:
    //     'Inspire-se a cumprir o IDE e levar o Evangelho de Cristo por toda a terra.',
    //   imgUrl:
    //     'https://res.cloudinary.com/dez4evjlq/image/upload/v1724546115/LandingPage/2_flhojz.gif',
    //   link: '',
    // },
    // {
    //   Id: 1,
    //   title: 'Mídias',
    //   descricao:
    //     'Estratégias e ferramentas para usar as mídias à favor da obra de Deus. Alncançando vidas!',
    //   imgUrl:
    //     'https://res.cloudinary.com/dez4evjlq/image/upload/v1724546157/LandingPage/3_emixsq.gif',
    //   link: '',
    // },
    // {
    //   Id: 1,
    //   title: 'Missão',
    //   descricao:
    //     'Aprenda sobre a importância da Missão e como ser um missionário de Cristo.',
    //   imgUrl:
    //     'https://res.cloudinary.com/dez4evjlq/image/upload/v1724546169/LandingPage/4_lsruci.gif',
    //   link: '',
    // },
  ];
  loading = false;

  constructor(
    private _avaServive: avaService
  ) {

  }

  ngOnInit(): void {
    this.loadDados();
  }

  loadDados(){
    this.loading = true;

    try {
      this.getTotais();
    } catch (error) {
      console.error('Erro ao carregar dados!');
    }finally{
      this.loading = false;
    }
  }

  getTotais() {
    this._avaServive
      .getTotaisCursos()
      .then((data: any) => {
        console.log(data);
        
        this.cursando = data.Cursando;
        this.concluido = data.Concluido;

        this.tempoH = this.formatDuration(data.HorasCursadas);
        
        if (data.HorasCursadas > 0 && data.HorasTotais > 0) {
          
          this.percentual = (data.HorasCursadas / data.HorasTotais) * 100;
        }else{
          this.percentual = 0;
        }
      })
      .catch((err) => {
        console.error('Erro ao obter totais:', err);
      });
  }
  
  formatDuration(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }

    if (seconds === 0) {
      return "00:00:00";
    }
  
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  }
  
}  
