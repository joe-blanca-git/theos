import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { avaService } from '../services/ava.service';
import { aulaViewModel } from '../models/aulaView.model';
import { lastVideoModel } from '../models/lastVideo.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BunnyVideoService } from '../services/bunny-video.service';

@Component({
  selector: 'app-ava-curso-view',
  templateUrl: './ava-curso-view.component.html',
  styleUrls: ['./ava-curso-view.component.css'],
})
export class AvaCursoViewComponent implements OnInit {
  dadosAula: aulaViewModel[] = [];
  playlistAula: any = [];
  selectedVideo: any = [];
  videoId: string = '';
  fileLink: SafeResourceUrl | undefined;
  loading: boolean = false;
  avisoVideo: boolean = false;
  Titulo: string = '';
  DescSm: string = '';
  Finish: boolean = false;
  visibleAvalia: boolean = false;
  queryVideoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private _avaService: avaService,
    private notification: NotificationService,
    private bunnyService: BunnyVideoService
  ) {}

  ngOnInit(): void {
    this.loadDados();

  }

  async loadDados() {
    this.loading = true;

    try {
      await this.getAulas();
      await this.checkIfAllVideosViewed();
    } catch (error) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        String(error)
      );
    }finally{
      this.loading = false;
    }
  }

  // 1 - obtem aulas do modulo
  getAulas() {
    const cursoId = this.route.snapshot.queryParamMap.get('curso');
    const moduloId = this.route.snapshot.queryParamMap.get('modulo');
    const queryVideoId = this.queryVideoId;
  
    const buildPlayer = (videoId: string) => {
      const tokenSecurityKey = '3aa62b7d-a6fb-47d8-8680-c401e4eca5ab';
      const expiration = 1746385145;
  
      this.gerarTokenSHA256_HEX(tokenSecurityKey, videoId, expiration).then(token => {
        this.bunnyService.getVideoData(token, videoId, expiration).subscribe({
          next: (res) => this.insertIframe(res.html, token, expiration),
          error: (err) => {
            console.error('Erro ao buscar vídeo:', err);
            this.avisoVideo = true;
          }
        });
      }).catch(err => console.error('Erro ao gerar token:', err));
    };
  
    const carregarDadosAula = (videoId: string) => {
      const video = this.playlistAula.find((v: any) => v.IdVideo === Number(videoId));
      if (video?.UrlVideo) {
        buildPlayer(video.UrlVideo);
      } else {
        this.avisoVideo = true;
      }
  
      this.playlistAula.forEach((item: any) => {
        item.StatusView = item.IdVideo === Number(videoId) ? 'V' : item.StatusView;
        item.Active = item.IdVideo === Number(videoId);
      });
      
      this.marcarView(Number(cursoId), Number(moduloId), Number(videoId));
    };
  
    this._avaService.getAulaView(cursoId, moduloId).then((aulasData) => {
      this.dadosAula = aulasData;
      const aula = aulasData[0];
      this.Titulo = aula.Titulo;
      this.DescSm = aula.DescSm;
      this.playlistAula = aula.Aulas;     
  
      if (queryVideoId) {
        carregarDadosAula(queryVideoId);
      } else {
        this._avaService.getLastVideo(cursoId, moduloId).then((lastVideo) => {
          this.selectedVideo = lastVideo.message === 'Not Found' ? null : lastVideo;
          const videoId = this.selectedVideo?.[0]?.VideoId ?? this.playlistAula[0]?.IdVideo;
          carregarDadosAula(videoId);
        });
      }
    });

    
    
  }
  
  insertIframe(html: string, token: string, expires: number): void {
    try {
      const iframeDiv = document.getElementById('iframeVideo');
    if (iframeDiv) {

      let modifiedHtml = html.replace(/width="[^"]*"/, 'width="850"').replace(/height="[^"]*"/, 'height="480"');
      
      const urlMatch = modifiedHtml.match(/src="([^"]*)"/);
      if (urlMatch) {
        let iframeUrl = urlMatch[1];
  
        const urlWithParams = `${iframeUrl}&token=${token}&expires=${expires}`;
        modifiedHtml = modifiedHtml.replace(iframeUrl, urlWithParams);
      }
  
      iframeDiv.innerHTML = modifiedHtml;
    }
    } catch (error) {
      console.error('Erro ao carregar Player!');
    }
  }
  
  async gerarTokenSHA256_HEX(token_security_key: string, video_id: string, expiration: number): Promise<string> {
    const data = token_security_key + video_id + expiration;
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');    
    return hashHex;
  }

  marcarView(curso: number, aula: number, video: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = {
        Curso: curso,
        Aula: aula,
        Video: video,
      };

      this._avaService
        .postMarkView(json)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('Erro ao marcar a visualização:', error);
          reject(error);
        });
    });
  }

  loadVideo(idVideo: any): void {
    this.queryVideoId = idVideo; 
    this.getAulas();           
  }
  
  checkIfAllVideosViewed(): void {
    this.Finish = this.playlistAula.every(
      (video: any) => video.StatusView === 'V'
    );
  }

  finishLesson(): Promise<any> {
    const cursoId = this.route.snapshot.queryParamMap.get('curso');
    const aulaId = this.route.snapshot.queryParamMap.get('modulo');

    return new Promise((resolve, reject) => {
      const json = {
        Curso: cursoId,
        Aula: aulaId,
      };

      this._avaService
        .postFinishLesson(json)
        .then((response) => {
          resolve(response);
          this.visibleAvalia = true;
          //this.router.navigate(['/ava/ava-curso-detalhe'], { queryParams: { curso: cursoId } });
        })
        .catch((error) => {
          console.error('Erro ao concluir aula:', error);
          reject(error);
        });
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  }
  
  ///////////////////////////////////////
  authenticateAluno() {
    return true;
  }

}
