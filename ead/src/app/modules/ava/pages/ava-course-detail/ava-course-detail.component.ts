import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { CourseDetailModel } from '../../models/courses.model';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormPaymentComponent } from '../../../../shared/components/forms/form-payment/form-payment.component';

@Component({
  selector: 'app-ava-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzRateModule,
    NzModalModule,
    FormPaymentComponent,
    RouterLink,
  ],
  templateUrl: './ava-course-detail.component.html',
  styleUrls: [
    './ava-course-detail.component.scss',
    '../../ava.app.component.scss',
  ],
})
export class AvaCourseDetailComponent {
  titlePage = 'AVAT - Área Virtual do Aluno Theos';
  descriptionPage = 'ÁREA VIRTUAL DO ALUNO THEOS - Detalhes do Curso';
  loading = false;
  isVisibleMenuPay = false;
  course!: CourseDetailModel;

  method = 'pix';
  paymentStatus = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CoursesService,
  ) {}

  ngOnInit(): void {
    this.getCourse();
  }

  async watchPayment(paymentId: string): Promise<void> {
    const interval = setInterval(async () => {
      try {
        const response = await this.courseService.getPayment(paymentId);

        if (response?.Status === 'PAID' || response?.Status === 'RECEIVED') {
          this.isVisibleMenuPay = false;
          clearInterval(interval);
          this.getCourse();
        }
      } catch (e) {
        console.error('Erro ao verificar pagamento', e);
      }
    }, 5000);
  }

  async getCourse() {
    this.route.queryParams.subscribe(async (params) => {
      const courseId = Number(params['course']);

      if (!courseId) {
        console.error('courseId inválido');
        return;
      }

      this.loading = true;
      this.course = await this.courseService.getCourseDetail(courseId);
      this.loading = false;
    });
  }

  goToLearn() {
    if (this.course.PaymentStatus === 'pending') {
      this.router.navigate(['avat/payments']);
      return;
    }

    if (this.course.AllowedCourse) {
      const queryParams: any = {
        course: this.course.CourseId,
      };

      if (
        this.course.LastView?.LastModuleView != null &&
        this.course.LastView?.LastLessonView != null
      ) {
        queryParams.module = this.course.LastView.LastModuleView;
        queryParams.lesson = this.course.LastView.LastLessonView;
      }

      this.router.navigate(['avat/learn'], { queryParams });
      return;
    }

    this.isVisibleMenuPay = true;
  }

  selectMethod(method: string) {
    if (method === 'pix') {
      this.method = 'pix';
    }
  }

  handleCancel(): void {
    this.getCourse();
    this.isVisibleMenuPay = false;
  }

  formatBrl(valor: number | string): string {
    const numero = Number(valor);

    if (isNaN(numero)) {
      return 'R$ 0,00';
    }

    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
