import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CoursesService } from '../../../courses/services/courses.service';

export interface ICartCourse {
  id: number;
  title: string;
  description: string;
  imgCoverLink: string;
  priceSingle: number;
  totalLessons: number;
  totalHours: number;
  category: string;
}

@Component({
  selector: 'app-financial-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './financial-cart.component.html',
  styleUrl: './financial-cart.component.scss'
})
export class FinancialCartComponent implements OnInit {

  course: ICartCourse | null = null;
  courseDetail: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.router.navigate(['/courses']);
      return;
    }

    const courseId = Number(idParam);
    this.isLoading = true;

    try {
      const [courseSummary, detail] = await Promise.all([
        this.coursesService.getCourseCheckoutSummary(courseId),
        this.coursesService.getCourseDetail(courseId)
      ]);
      this.course = courseSummary;
      this.courseDetail = detail;
      console.log('Dados do curso recebidos:', this.course, this.courseDetail);
    } catch (error) {
      console.error('Erro ao carregar os dados do curso', error);
      this.router.navigate(['/courses']);
    } finally {
      this.isLoading = false;
    }
  }

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  get selectedPrice(): number {
    if (!this.course) return 0;
    return this.course.priceSingle;
  }

  get selectedLabel(): string {
    return 'Compra Avulsa';
  }

  onCheckout(): void {
    if (this.course) {
      this.router.navigate(['/financial/payment', this.course.id], { queryParams: { plan: 'single' } });
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
