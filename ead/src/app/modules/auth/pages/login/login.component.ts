import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormLoginComponent } from "../../../../shared/components/forms/form-login/form-login.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormLoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  typeUser: string  = '';
  pageTitle: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.typeUser = params['user'] || '';
    });

    if (this.typeUser === 'teacher') {
      this.pageTitle = 'PORTAL DO PROFESSOR';
    }else{
      this.pageTitle = 'PORTAL DO ALUNO';
    }
  }


}
