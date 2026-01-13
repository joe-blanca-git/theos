import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormLoginComponent } from '../../../../shared/components/forms/form-login/form-login.component';
import { FormRecoveryComponent } from "../../../../shared/components/forms/form-recovery/form-recovery.component";
import { FormReplaceComponent } from "../../../../shared/components/forms/form-replace/form-replace.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormLoginComponent, FormRecoveryComponent, FormReplaceComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  typeUser: string = '';
  pageTitle: string = '';
  currentUrl: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.typeUser = params['user'] || '';
    });

    if (this.typeUser === 'teacher') {
      this.pageTitle = 'PORTAL DO PROFESSOR';
    } else {
      this.pageTitle = 'PORTAL DO ALUNO';
    }

     this.currentUrl = this.router.url.split('?')[0];
  }
}
