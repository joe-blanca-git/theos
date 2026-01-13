import { Component } from '@angular/core';
import { LandingCoursesModel } from '../models/landing.model';
import { LandingService } from '../services/landing.service';
import { CommonModule } from '@angular/common';
import { LandingFooterComponent } from '../../../shared/layouts/landing-footer/landing-footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-home',
  standalone: true,
  imports: [CommonModule, LandingFooterComponent, RouterModule],
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.scss',
})
export class LandingHomeComponent {
  landingHome: LandingCoursesModel = { Courses: [] };
  loading = false;
  error: string | null = null;

  constructor(private landingService: LandingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.landingHome = await this.landingService.getCourses();
      console.log(this.landingHome);
    } catch (err) {
      this.error = 'Erro ao carregar cursos';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  get coursesCount(): number {
    return this.landingHome?.Courses?.length ?? 0;
  }

  get studentsCount(): number {
    return (
      this.landingHome?.Courses?.reduce(
        (total, course) => total + (course.Students ?? 0),
        0
      ) ?? 0
    );
  }

  get priceFormat(): (value: number) => string {
  return (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
}
}
