import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FinancialService, CheckoutSummary, PixResponse, PendenciaDTO } from '../../services/financial.service';
import { CoursesService } from '../../../courses/services/courses.service';
import { SignalRService, PaymentNotification } from '../../../../../core/services/signalr.service';
import { AuthUtil } from '../../../../../core/auth/auth.util';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-financial-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './financial-payment.component.html',
  styleUrl: './financial-payment.component.scss'
})
export class FinancialPaymentComponent implements OnInit {
  paymentMethod: 'PIX' | 'CREDIT' = 'PIX';
  
  // States
  isProcessing = false;
  paymentSuccess = false;
  paymentPending = false;
  paymentError = false;
  errorMessage = '';

  // Forms
  cardForm!: FormGroup;
  
  // PIX specifics
  pixCpf = '';
  pixHolderName = '';
  qrCodeGenerated = false;
  pixCopiaECola = '';
  qrCodeUrl = '';
  isLoadingPix = false;

  // Business Rules States
  transacaoPendente: PendenciaDTO | null = null;
  bloquearOutrosMetodos = false;
  purchaseId: number | null = null;
  isCancelingPix = false;
  isCancelingCredit = false;

  cursoId: number = 0;
  checkoutSummary?: CheckoutSummary;
  tipoCompra: 'AVULSO' = 'AVULSO';
  valorTotal = 0;
  isLoadingCourse = true;
  isLoadingPendencies = true;

  // Mock data for installments
  installments: { value: number, label: string }[] = [];

  private broadcastChannel: BroadcastChannel;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private financialService: FinancialService,
    private coursesService: CoursesService,
    private signalRService: SignalRService,
    private authUtil: AuthUtil,
    private toastService: ToastService
  ) {
    this.broadcastChannel = new BroadcastChannel('payment_sync_channel');
    this.broadcastChannel.onmessage = (event) => {
      if (event.data === 'payment_confirmed') {
        this.redirectOnSuccess(this.cursoId);
      }
    };
  }

  ngOnDestroy() {
    this.broadcastChannel.close();
  }

  ngOnInit() {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.cursoId = Number(idParam);
      this.loadCourseData();
    } else {
      this.router.navigate(['/courses']);
    }

    // Inicializar o WebSocket (SignalR)
    const token = this.authUtil.getCookieAuth();
    if (token) {
      // Como SignalR precisa apenas da base URL
      this.signalRService.startConnection(token, this.financialService.getApiUrl());

      this.signalRService.paymentConfirmed$.subscribe((notification: PaymentNotification) => {
        if (notification.sucesso) {
          this.broadcastChannel.postMessage('payment_confirmed');
          this.toastService.success('Pagamento processado e aprovado com sucesso!');
          this.redirectOnSuccess(notification.cursoId);
        }
      });

      this.signalRService.reconnected$.subscribe(() => {
        console.log('WebSocket reconectado, verificando pendências atualizadas...');
        this.verificarPendencias();
      });
    }

    this.verificarPendencias();
  }

  redirectOnSuccess(cursoId: number) {
    this.router.navigate(['/courses/course-detail', cursoId]);
  }

  verificarPendencias() {
    this.financialService.verificarPendencias(this.cursoId).subscribe({
      next: (res: PendenciaDTO) => {
        if (res && res.jaPago) {
          this.toastService.info('Você já possui acesso ativo a este conteúdo!');
          this.router.navigate(['/courses/course-detail', this.cursoId]);
          this.isLoadingPendencies = false;
          return;
        }

        if (res && res.temPendencia) {
          this.transacaoPendente = res;
          this.tratarPendencia(res);
        } else {
          // Se backend disser que não tem pendência (foi cancelado ou expirou), liberamos a UI
          this.transacaoPendente = null;
          this.purchaseId = null;
          this.bloquearOutrosMetodos = false;
          this.qrCodeGenerated = false;
          this.pixCopiaECola = '';
          this.qrCodeUrl = '';
        }
        this.isLoadingPendencies = false;
      },
      error: (err) => {
        console.error('Erro ao verificar pendências', err);
        this.isLoadingPendencies = false;
      }
    });
  }

  tratarPendencia(pendencia: PendenciaDTO) {
    if (pendencia.purchaseId) {
      this.purchaseId = pendencia.purchaseId;
    }

    // Fallback: se o backend enviar o erro cru do Asaas, tratamos no front para melhorar a UX
    if (pendencia.mensagem && (pendencia.mensagem.includes('Asaas.GetPixQrCodeAsync') || pendencia.mensagem.includes('invalid_action'))) {
      pendencia.mensagem = 'O PIX gerado anteriormente expirou ou é inválido. Por favor, cancele-o para liberar o pagamento.';
    }
    
    if (pendencia.metodoPagamento === 'PIX' && pendencia.status === 'PENDING') {
      this.bloquearOutrosMetodos = true;
      this.setPaymentMethod('PIX');
      if (pendencia.pixCopiaECola && pendencia.qrCodeBase64) {
        this.qrCodeGenerated = true;
        this.pixCopiaECola = pendencia.pixCopiaECola;
        this.qrCodeUrl = pendencia.qrCodeBase64;
      }
    } else if (pendencia.metodoPagamento === 'CREDIT') {
      if (pendencia.status === 'REJECTED') {
        // Se for crédito recusado, pré-seleciona a aba Crédito
        this.setPaymentMethod('CREDIT');
      } else {
        // Se for pendente e for crédito
        this.setPaymentMethod('CREDIT');
        this.paymentPending = true;
        pendencia.mensagem = pendencia.mensagem || 'Pagamento em análise pelo sistema antifraude.';
      }
    }
  }

  async loadCourseData() {
    this.isLoadingCourse = true;
    try {
      const data = await this.coursesService.getCourseCheckoutSummary(this.cursoId);
      this.checkoutSummary = data as CheckoutSummary;
      this.isLoadingCourse = false;
      
      // Mantemos a leitura do plan via query param para decidir o fluxo
      this.tipoCompra = 'AVULSO';
      this.calcularParcelas();
    } catch (err) {
      console.error('Erro ao carregar curso', err);
      this.isLoadingCourse = false;
      // Backend failure -> show error on UI instead of mock
      this.errorMessage = 'Não foi possível carregar os dados do curso. Tente novamente mais tarde.';
    }
  }

  calcularParcelas() {
    if (!this.checkoutSummary) return;

    this.installments = [];
    const maxParcelas = 12;

    this.valorTotal = this.checkoutSummary.priceSingle;
    for (let i = 1; i <= maxParcelas; i++) {
      if (i === 1) {
        this.installments.push({
          value: i,
          label: `1x de ${this.formatPrice(this.valorTotal)} sem juros`
        });
      } else {
        // Juros mock de 2.5% simples pra avulso
        const juros = 0.025;
        const valorComJuros = this.valorTotal * (1 + (juros * i));
        const parcela = valorComJuros / i;
        this.installments.push({
          value: i,
          label: `${i}x de ${this.formatPrice(parcela)} (com juros)`
        });
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  get purchaseSummary() {
    let valorCurso = this.valorTotal;
    let taxas = 0;
    let juros = 0;
    let total = this.valorTotal;
    let installmentCount = 1;

    if (this.paymentMethod === 'CREDIT' && this.cardForm) {
      installmentCount = Number(this.cardForm.get('installments')?.value || 1);
      if (installmentCount > 1) {
        // Juros mock de 2.5% simples ao mês
        const jurosRate = 0.025;
        juros = this.valorTotal * (jurosRate * installmentCount);
        total = this.valorTotal + juros;
      }
    }

    return {
      valorCurso,
      taxas,
      juros,
      total,
      installmentCount
    };
  }

  initForm() {
    this.cardForm = this.fb.group({
      cpfTitular: ['', [Validators.required, Validators.minLength(11)]],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
      cardHolder: ['', [Validators.required, Validators.minLength(3)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2,4})$/)]],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      installments: [1]
    });
  }

  setPaymentMethod(method: 'PIX' | 'CREDIT') {
    if (this.bloquearOutrosMetodos && this.transacaoPendente?.metodoPagamento !== method) {
      return;
    }
    this.paymentMethod = method;
    this.paymentError = false;
    this.paymentSuccess = false;
    this.paymentPending = false;
    this.errorMessage = '';
  }

  generatePix() {
    if (this.pixCpf && this.pixCpf.length >= 11) {
      this.isLoadingPix = true;
      this.errorMessage = '';
      
      this.financialService.gerarPixAsaas({
        cursoId: this.cursoId,
        cpf: this.pixCpf,
        holderName: this.pixHolderName,
        valor: this.valorTotal,
        tipoCompra: 'AVULSO'
      }).subscribe({
        next: (res: PixResponse) => {
          this.isLoadingPix = false;
          if (res.sucesso) {
            this.qrCodeGenerated = true;
            this.qrCodeUrl = res.qrCode;
            this.pixCopiaECola = res.pixCopiaECola;
            
            if (res.purchaseId) {
              this.purchaseId = res.purchaseId;
            }
            
            // Regra: Bloquear outras abas
            this.transacaoPendente = {
              temPendencia: true,
              purchaseId: res.purchaseId,
              status: 'PENDING',
              metodoPagamento: 'PIX',
              pixCopiaECola: res.pixCopiaECola,
              qrCodeBase64: res.qrCode,
              mensagem: 'Você gerou um PIX e ele está aguardando pagamento.'
            };
            this.bloquearOutrosMetodos = true;

          } else {
            this.errorMessage = 'Ocorreu um erro ao gerar o PIX.';
          }
        },
        error: (err: any) => {
          this.isLoadingPix = false;
          this.errorMessage = err.error?.message || 'Falha na comunicação com o servidor. Verifique seu CPF e tente novamente.';
        }
      });
    }
  }

  copyPixCode() {
    // Mock copy to clipboard
    alert('Código PIX copiado para a área de transferência!');
  }

  processPayment() {
    // Basic validation
    if (this.paymentMethod !== 'PIX' && this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.paymentError = false;
    this.paymentSuccess = false;
    this.paymentPending = false;
    this.errorMessage = '';

    const formValues = this.cardForm.value;
    let expiryMonth = '';
    let expiryYear = '';

    if (formValues.expiry) {
      const parts = formValues.expiry.split('/');
      if (parts.length === 2) {
        expiryMonth = parts[0];
        expiryYear = parts[1];
      }
    }

    const payload = {
      cursoId: this.cursoId,
      valor: this.valorTotal,
      tipoCompra: 'AVULSO',
      cpf: formValues.cpfTitular,
      paymentMethod: this.paymentMethod, // 'CREDIT'
      holderName: formValues.cardHolder,
      number: formValues.cardNumber,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      ccv: formValues.cvc,
      installments: formValues.installments
    };

    this.financialService.checkoutCard(payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        if (res.sucesso) {
          if (res.status === 'CONFIRMED' || res.status === 'RECEIVED') {
            this.paymentSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/courses']);
            }, 3000);
          } else {
            // Se for PENDING ou outro status não reprovado/confirmado
            this.paymentPending = true;
            this.bloquearOutrosMetodos = true;
            this.transacaoPendente = {
              temPendencia: true,
              purchaseId: res.purchaseId,
              status: res.status,
              metodoPagamento: this.paymentMethod,
              mensagem: 'Pagamento em análise pelo sistema antifraude.'
            };
          }
        } else {
          this.paymentError = true;
          this.errorMessage = 'Pagamento recusado pela operadora.';
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.paymentError = true;
        this.errorMessage = err.error?.message || err.error?.detalhe || 'Ocorreu um erro ao processar seu cartão. Verifique os dados.';
      }
    });
  }

  cancelPix() {
    if (!this.purchaseId) return;

    this.isCancelingPix = true;
    this.financialService.cancelPurchase(this.purchaseId).subscribe({
      next: () => {
        this.isCancelingPix = false;
        this.toastService.success('Cobrança PIX cancelada com sucesso!');
        // Reset states
        this.purchaseId = null;
        this.transacaoPendente = null;
        this.bloquearOutrosMetodos = false;
        this.qrCodeGenerated = false;
        this.pixCopiaECola = '';
        this.qrCodeUrl = '';
      },
      error: (err) => {
        this.isCancelingPix = false;
        console.error('Error canceling pix', err);
        this.toastService.error('Erro ao cancelar a cobrança PIX. Tente novamente mais tarde.');
      }
    });
  }

  cancelPendingCredit() {
    if (!this.purchaseId) return;

    this.isCancelingCredit = true;
    this.financialService.cancelPurchase(this.purchaseId).subscribe({
      next: () => {
        this.isCancelingCredit = false;
        this.toastService.success('Transação cancelada. Você pode tentar outra forma de pagamento.');
        // Reset states
        this.purchaseId = null;
        this.transacaoPendente = null;
        this.bloquearOutrosMetodos = false;
        this.paymentPending = false;
        
        // Reset card form
        this.cardForm.reset();
      },
      error: (err) => {
        this.isCancelingCredit = false;
        console.error('Error canceling credit', err);
        this.toastService.error('Erro ao cancelar a transação. Tente novamente.');
      }
    });
  }
}
