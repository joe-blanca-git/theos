import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './../../shared/services/auth.service';
import { cursoPreviewModel } from 'src/app/pages/landing/models/cursoPreview.model';
import { avaService } from './services/ava.service';

@Component({
  selector: 'ava-app-root',
  templateUrl: './ava.component.html',
  styleUrls: ['./ava.component.css'],
})
export class AvaAppComponent {
  isCollapsed = false;
  visible = false;
  visibleHeader = true;
  loading: boolean = false;
  urlIcoTheos: string = 'https://i.imgur.com/ISvbhQp.png';
  userLogado: string = '';
  urlImgHomeHeader: string =
    'https://res.cloudinary.com/dez4evjlq/image/upload/v1726090869/capa_home_lw0b3e.png';
  urlImgCursosHeader: string =
    'https://res.cloudinary.com/dez4evjlq/image/upload/v1724805893/birthday_2_wj9bl1.png';
  urlImgCursandoHeader: string =
    'https://res.cloudinary.com/dez4evjlq/image/upload/v1724806047/birthday_4_sqwc1y.png';
  urlImgPagamentoHeader: string =
    'https://res.cloudinary.com/dtpiwazxi/image/upload/v1745267323/birthday_zrsjk7.png';
  urlImgHeader: string = '';
  dadosAula: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private avaService: avaService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    try {
      const userJson: any = localStorage.getItem('THEOS.ava.user');

      if (!userJson) {
        console.error('Usuário não encontrado');
        this.authService.logout();
        this.isAuthenticated();
      }
  
      const user = JSON.parse(userJson);
      this.userLogado = user.username.toUpperCase();
  
      this.obtemClaims();
      this.checkUrlAndUpdateVisibility();
  
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkUrlAndUpdateVisibility();
        });
    }finally{
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    }

      


  }

  obtemClaims() {
    // const user = localStorage.getItem('bitADMIN.user');
    // if (user) {
    //   this._user = JSON.parse(user);
    //   if (this._user && Array.isArray(this._user.claims)) {
    //     this.userLabel = this._user.username;
    //     const allowedRoles = ['STANDARD', 'PRO', 'MASTER', 'ADMIN'];
    //     const userRoles = this._user.claims
    //       .filter((claim: any) => claim.type === 'role')
    //       .map((claim: any) => claim.value);
    //     this.filteredMenuItems = this.menuFinanceiro.filter(item =>
    //       item.claim.some((claim: string) => userRoles.includes(claim))
    //     );
    //   } else {
    //     console.error('Estrutura do token de usuário inválida:', this._user);
    //   }
    // } else {
    //   console.error('Usuário não encontrado no localStorage');
    // }
  }

  isAuthenticated(): boolean {
    if (!this.authService.loggedIn) {
      this.router.navigate(['./login']);
      return true;
    }
    return true;
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated();
  }

  private checkUrlAndUpdateVisibility(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('ava-cursos')) {
      this.urlImgHeader = this.urlImgCursosHeader;
    } else if (currentUrl.includes('ava-cursando')) {
      this.urlImgHeader = this.urlImgCursandoHeader;
    } else if (currentUrl.includes('ava-buy')) {
      this.urlImgHeader = this.urlImgPagamentoHeader;
    } else if (currentUrl.includes('ava-curso-view')) {
      this.obtemUrlCurso();
    } else if (currentUrl.includes('ava-curso-detalhe')) {
      this.obtemUrlCurso();
    } else {
      this.urlImgHeader = this.urlImgHomeHeader;
    }
  }

  async obtemUrlCurso() {
    this.loading = true;

    try {
      const cursoId = this.route.snapshot.queryParamMap.get('curso');
      await this.avaService.getPreview(cursoId).then((data) => {
        this.dadosAula = data.map((item: any) =>
          new cursoPreviewModel().mapFromApi(item)
        );
        const filteredAulas = this.dadosAula.filter(
          (entry: cursoPreviewModel) => entry.Status == 'A'
        );
        this.dadosAula = filteredAulas;
        this.urlImgHeader = this.dadosAula[0].UrlHeaderView;
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  openMenu(): void {
    this.visible = true;
    this.isCollapsed = false;
  }

  closeMenu(): void {
    this.visible = false;
    this.isCollapsed = true;
  }
}
