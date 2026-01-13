import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-payment.component.html',
  styleUrl: './form-payment.component.scss',
})
export class FormPaymentComponent implements OnInit {
  @Input() course!: any;
  @Input() method!: string;
  @Output() paymentId = new EventEmitter<string>();

  pixPayment: any | null = null;
  loading = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    if (!this.course || !this.method) return;

    this.loading = true;

    const paymentRequest = {
      value: this.course.Price,
      method: this.method,
    };

    this.paymentService
      .createPayment(paymentRequest, this.course.CourseId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.pixPayment = response;
          if (response?.pix.id) {
            this.paymentId.emit(response.pix.id);
          }
        },
        error: (err) => {
          console.error('Erro ao gerar pagamento:', err);
          this.pixPayment = null;
        },
      });
  }

  copyPixCode(): void {
    if (!this.pixPayment?.payload) return;
    navigator.clipboard.writeText(this.pixPayment.payload);
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
