import { Component, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

declare const MercadoPago: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements AfterViewInit {
  @Input('amount') amount!: number;
  @Input('userId') userId!: number;
  @Input('courseId') courseId!: number;

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

  mp: any;
  bricksBuilder: any;
  loading = true;

  ngAfterViewInit(): void {
    this.mp = new MercadoPago('TEST-e2799477-226b-489c-b40d-b070c53f56f8');
    this.bricksBuilder = this.mp.bricks({ theme: 'dark' });

    try {
      this.renderPaymentBrick();
    } catch (error) {
      this.loading = false;
    }
  }

  renderPaymentBrick() {
    const settings = {
      initialization: {
        amount: this.amount,
      },
      customization: {
        paymentMethods: {
          ticket: 'all',
          creditCard: 'all',
          prepaidCard: 'all',
          debitCard: 'all',
          mercadoPago: 'all',
        },
      },
      callbacks: {
        onReady: () => {},
        onSubmit: ({ selectedPaymentMethod, formData }: any) => {
          return new Promise((resolve, reject) => {
            const payload = {
              ...formData,
              user: this.userId,
              course: this.courseId,
            };

            fetch(
              'https://institutotheos.com.br/api/model/ava/pagamento/buy.php',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              }
            )
              .then((res) => res.json())
              .then((data) => {
                if (
                  (data?.status === 'approved' ||
                    data?.status === 'in_process' ||
                    data?.status === 'in_mediation') &&
                  data?.id_pagamento
                ) {

                  let message = '';
                  let colorBg = '';
                  let color = '';
                  let type: any;

                  if (data.status === 'approved') {
                    message = 'Pagamento Realizado com Sucesso! Acesse seus cursos e comece a estudar!';
                    colorBg = 'bg-success';
                    color = 'text-light';
                    type = 'success';
                  }else if (data.status === 'in_process') {
                    message = 'Pagamento Pendente! Verifique seus pagamentos em Minha Conta!';
                    colorBg = 'bg-warning';
                    color = 'text-danger';
                    type = 'warning';
                  }else if (data.status === 'in_mediation') {
                    message = 'Pagamento Pendente! Aprove o pagamento em seu aplicativo bancário!';
                    colorBg = 'bg-warning';
                    color = 'text-danger';
                    type = 'warning';
                  }
                  this.notification.createBasicNotification(type,colorBg, color, message);

                  this.router.navigate([
                    '/ava/ava-home'
                  ]);

                } else {
                  
                  let message = '';
                  if (data.status === 'rejected') {
                    message = 'Pagamento Rejeitado, verifique seus dados e tente novamente!'
                  }else if (data.status === 'cancelled') {
                    message = 'Pagamento Cancelado, verifique seus dados e tente novamente!'
                  };

                  this.notification.createBasicNotification('error','bg-danger', 'text-light', message);

                  console.error(message, data);
                  reject('Pagamento não aprovado');
                }
                resolve(true);
              })

              .catch((err) => {
                console.error('Erro no pagamento:', err);
                reject(err);
              });
          });
        },
        onError: (error: any) => {
          console.error('Erro no Brick:', error);
        },
      },
    };

    this.bricksBuilder.create('payment', 'paymentBrick_container', settings);
  }
}
