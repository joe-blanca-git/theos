import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { cursosModel } from '../models/cursosModel';
import { avpService } from '../services/avp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-avp-curso-detalhe',
  templateUrl: './avp-curso-detalhe.component.html',
  styleUrls: [
    './avp-curso-detalhe.component.css',
    '../avp-cursos/avp-cursos.component.css',
  ],
})
export class AvpCursoDetalheComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  dadosCurso: cursosModel[] = [];
  listModulos: any[] = [];
  listAulas: any[] = [];
  listCategorias: any = [
    {
      Id: 5,
      Nome: 'Pregação',
    },
    {
      Id: 6,
      Nome: 'Evangelismo',
    },
    {
      Id: 7,
      Nome: 'Midia',
    },
    {
      Id: 8,
      Nome: 'Missão',
    },
  ];

  isVisibleModule = false;
  isVisibleLesson = false;

  imageError: string = '';
  imgPosterCursoBase: string = '';
  imgCapaCursoBase: string = '';
  imgCapaModuloBase: string = '';

  pageIndex = 1;

  infoCursoForm: FormGroup;
  modulosForm: FormGroup;
  aulasForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public avpService: avpService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.infoCursoForm = this.fb.group({
      Id: ['', Validators.required],
      Titulo: ['', Validators.required],
      Categoria: ['', Validators.required],
      Valor: ['', Validators.required],
      DescricaAbreviada: ['', Validators.required],
      DescricaoCompleta: ['', Validators.required],
    });

    this.modulosForm = this.fb.group({
      TituloModulo: ['', Validators.required],
      DescricaoModulo: ['', Validators.required],
      OrdemModulo: ['', Validators.required],
    });

    this.aulasForm = this.fb.group({
      NrVideo: ['', Validators.required],
      Duracao: ['', Validators.required],
      TituloModuloAula: ['', Validators.required],
      TituloAula: ['', Validators.required],
      DescricaoAula: ['', Validators.required],
      UrlVideo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const idCurso = params['Curso'];
      this.getCursos(idCurso);
    });
  }

  saveInfo() {
    const curso: any = this.infoCursoForm.value;

    curso.ImgPoster = this.imgPosterCursoBase;
    curso.ImgHeader = this.imgCapaCursoBase;

    if (this.infoCursoForm.valid) {
      this.avpService.saveInfoCurso(curso).subscribe({
        next: (res) => {
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            res.message
          );
        },
        error: (err) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            err.error
          );
        },
        complete: () => {
          console.log('register complete');
        },
      });
    } else {
      return;
    }
  }

  removeAula(aula: any): void {
    this.avpService.deleteAula(aula.AulaId, aula.ModuloId)?.subscribe({
      next: (res) => {
        this.listAulas = this.listAulas.filter((a) => a.AulaId !== aula.AulaId);
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          res.message
        );
      },
      error: (err) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          err.error
        );
      },
      complete: () => {
        this.getAulas;
      },
    });
  }

  removeModulo(modulo: any): void {
    this.listModulos = this.listModulos.filter((item) => item !== modulo);

    this.avpService
      .deleteModulo(modulo.ModuloId, this.dadosCurso[0].Id)
      ?.subscribe({
        next: (res) => {
          this.getCursos(modulo.CursoId);
          console.log('Módulo excluído com sucesso:', res);
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            res.message
          );
        },
        error: (err) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            err.error
          );
        },
      });
  }

  removePoster() {
    this.imgPosterCursoBase = '';

    const fileInput: HTMLInputElement = document.getElementById(
      'PosterCurso'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.imageError = '';
  }

  removeCapaCurso() {
    this.imgCapaCursoBase = '';

    const fileInput: HTMLInputElement = document.getElementById(
      'capaCurso'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.imageError = '';
  }

  validateAndConvertImage(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      this.imageError =
        'Formato inválido! Apenas PNG, JPG, JPEG são permitidos.';
      input.value = '';
      return;
    }

    const img = new Image();

    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'poster') {
          if (img.width > 720 || img.height > 960) {
            this.imageError =
              'A imagem do Poster deve ter no máximo 360x960 pixels.';
            input.value = '';
            return;
          } else {
            this.imgPosterCursoBase = reader.result as string;
          }
        } else if (type === 'capaCurso') {
          if (img.width > 1280 || img.height > 360) {
            this.imageError =
              'A imagem da Capa deve ter no máximo 1280x360 pixels.';
            input.value = '';
            return;
          } else {
            this.imgCapaCursoBase = reader.result as string;
          }
        } else if (type === 'capaModulo') {
          if (img.width > 1280 || img.height > 720) {
            this.imageError = 'A imagem deve ter no máximo 1280x360 pixels.';
            input.value = '';
            return;
          } else {
            this.imgCapaModuloBase = reader.result as string;
          }
        }
        this.imageError = '';
      };
      reader.readAsDataURL(file);
    };
  }

  loadDados() {
    this.listModulos = this.dadosCurso[0].Modulos;
    this.imgPosterCursoBase = this.dadosCurso[0].UrlImgHeader;
    this.imgCapaCursoBase = this.dadosCurso[0].UrlHeaderView;
    this.infoCursoForm.patchValue({
      Id: this.dadosCurso[0].Id,
      Titulo: this.dadosCurso[0].Titulo,
      Categoria: this.dadosCurso[0].CategoriaId,
      Valor: this.dadosCurso[0].Valor,
      DescricaAbreviada: this.dadosCurso[0].DescricaoResumida,
      DescricaoCompleta: this.dadosCurso[0].Descricao,
    });
    this.getAulas();
  }

  ///// novas funções

  addAula(): void {
    if (this.aulasForm.invalid) {
      this.notification.createBasicNotification(
        'warning',
        'bg-warning',
        'text-danger',
        'Preencha todos os campos antes de adicionar.'
      );
      return;
    }

    if (this.aulasForm.valid) {
      const urlVideo = this.aulasForm.value.UrlVideo;

      const videoId = urlVideo.match(/\/d\/([a-zA-Z0-9_-]+)\//);

      const moduloId = this.aulasForm.get('TituloModuloAula')?.value;

      if (videoId && videoId[1]) {
        const novaAula = {
          Aula: {
            TituloAula: this.aulasForm.value.TituloAula,
            DescricaoAula: this.aulasForm.value.DescricaoAula,
            urlVideo: videoId[1],
            Curso: this.dadosCurso[0].Id,
            Modulo: moduloId,
            Duracao: this.aulasForm.value.Duracao,
            NrVideo: this.aulasForm.value.NrVideo,
          },
        };

        this.avpService.postAula(novaAula).subscribe({
          next: (res) => {
            this.notification.createBasicNotification(
              'success',
              'bg-success',
              'text-light',
              res.message
            );

            this.route.queryParams.subscribe((params) => {
              const idCurso = params['Curso'];
              this.getCursos(idCurso);
            });

            this.aulasForm.reset();
            this.handleCancelAula();
            this.cdr.detectChanges();
          },
        });
      } else {
        this.notification.createBasicNotification(
          'warning',
          'bg-warning',
          'text-danger',
          'URL do vídeo inválida.'
        );
      }
    }
  }

  addModulo(): void {
    if (this.modulosForm.invalid) {
      this.notification.createBasicNotification(
        'warning',
        'bg-warning',
        'text-danger',
        'Preencha todos os campos antes de adicionar.'
      );
      return;
    }

    if (this.modulosForm.valid) {
      const novoModulo = {
        Modulo: {
          Titulo: this.modulosForm.value.TituloModulo,
          Descricao: this.modulosForm.value.DescricaoModulo,
          nrAula: this.modulosForm.value.OrdemModulo,
          imgCapaModuloBase: this.imgCapaModuloBase,
          Curso: this.dadosCurso[0].Id,
        },
      };

      this.avpService.postModulo(novoModulo).subscribe({
        next: (res) => {
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            res.message
          );
          this.route.queryParams.subscribe((params) => {
            const idCurso = params['Curso'];
            this.getCursos(idCurso);
            this.handleCancelModulo();
          });
          this.cdr.detectChanges();
          this.modulosForm.reset();
          this.imgCapaModuloBase = '';
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        },
        error: (err) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            err.error
          );
        },
      });
    }
  }

  async getAulas() {
    this.listAulas = this.listModulos.flatMap((modulo) => modulo.Aulas || []);
  }

  getCursos(idCurso: number) {
    this.avpService.getCursos(idCurso)?.subscribe({
      next: (v: cursosModel[]) => {
        this.dadosCurso = v;
        this.loadDados();
      },
      error: (e: any) => console.error(e),
      complete: () => {
        // console.log('complete');
      },
    });
  }

  showNewModulo() {
    this.isVisibleModule = true;
  }

  showNewLesson() {
    this.isVisibleLesson = true;
  }

  handleOkModulo() {
    this.isVisibleModule = true;
  }

  handleCancelModulo() {
    this.isVisibleModule = false;
  }

  handleOkAula() {
    this.isVisibleLesson = true;
  }

  handleCancelAula() {
    this.isVisibleLesson = false;
  }
}
