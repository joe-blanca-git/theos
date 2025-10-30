import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-auth.component.html',
  styleUrl: './menu-auth.component.scss'
})
export class MenuAuthComponent {

}
