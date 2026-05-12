import { Component } from '@angular/core';
import { LocalStorageUtils } from '../../../../shared/utils/localstorage';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss'
})
export class UserPanelComponent {
  localStorageUtils = new LocalStorageUtils();
  
  userName: string = '';

  constructor(private autService: AuthService){

  }

  ngOnInit(): void {
    const user = this.localStorageUtils.obterUsuario();    
    this.userName = user.username;
  }

  logout(){
    this.autService.logout();
  }
}
