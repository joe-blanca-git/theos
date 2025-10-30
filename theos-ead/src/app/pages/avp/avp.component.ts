import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { cursoPreviewModel } from 'src/app/pages/landing/models/cursoPreview.model';



@Component({
    selector: 'avp-app-root',
    templateUrl: './avp.component.html',
    styleUrls: ['./avp.component.css']
  })
  export class avpAppComponent {
    isCollapsed = false;
    visible = false;
    visibleHeader = true;
    loading: boolean = false;    
    urlIcoTheos: string = 'https://i.imgur.com/ISvbhQp.png';
    userLogado: string = '';
    urlImgHomeHeader: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1726090869/capa_home_lw0b3e.png'
    urlImgCursosHeader: string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724805893/birthday_2_wj9bl1.png';
    urlImgCursandoHeader:string = 'https://res.cloudinary.com/dez4evjlq/image/upload/v1724806047/birthday_4_sqwc1y.png';
    urlImgHeader:string = '';
    dadosAula:any = [];
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private authService: AuthService,
    ) { }


    ngOnInit(): void {
      this.loading = true;

      const userJson:any = localStorage.getItem('THEOS.ava.user');

      if (!userJson) {
        console.error('Usuário não encontrado');
        this.authService.logout();
        this.isAuthenticated(); 
      }

      const user = JSON.parse(userJson);
      this.userLogado = user.username.toUpperCase();
      
      this.obtemClaims();

      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
  
    logout(){
      this.authService.logout();
      this.isAuthenticated();      
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