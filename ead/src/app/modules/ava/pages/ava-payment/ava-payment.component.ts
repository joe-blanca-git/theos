import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { CoursesService } from '../../services/courses.service';
import { PaymentsModel } from '../../../../shared/models/payment';

interface PaymentData {
  date: Date;
  description: string;
  paymentMethod: string;
  value: number;
  status: 'Pago' | 'Pendente' | 'Cancelado';
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<PaymentData> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<PaymentData> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-ava-payment',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './ava-payment.component.html',
  styleUrls: ['./ava-payment.component.scss', '../../ava.app.component.scss'],
})
export class AvaPaymentComponent {
  titlePage = 'AVAT - Meus Pagamentos';
  descriptionPage = 'ÁREA VIRTUAL DO ALUNO THEOS - Extrato de Pagamentos';
  loading = false;

  listOfColumns: ColumnItem[] = [
    {
      name: 'Data Vencimento',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.date.getTime() - b.date.getTime(),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'Descrição',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.description.localeCompare(b.description),
      filterMultiple: true,
      listOfFilter: [
        { text: 'Mensalidade', value: 'Mensalidade' },
        { text: 'Curso', value: 'Curso' },
      ],
      filterFn: (list: string[], item) =>
        list.some((value) => item.description.includes(value)),
    },
    {
      name: 'Forma de Pagamento',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
      filterMultiple: true,
      listOfFilter: [
        { text: 'Cartão', value: 'Cartão' },
        { text: 'PIX', value: 'PIX' },
        { text: 'Boleto', value: 'Boleto' },
      ],
      filterFn: (list: string[], item) =>
        list.some((value) => item.paymentMethod === value),
    },
    {
      name: 'Valor',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.value - b.value,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'Status',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.status.localeCompare(b.status),
      filterMultiple: true,
      listOfFilter: [
        { text: 'Pago', value: 'Pago' },
        { text: 'Pendente', value: 'Pendente' },
        { text: 'Cancelado', value: 'Cancelado' },
      ],
      filterFn: (list: string[], item) =>
        list.some((value) => item.status === value),
    },
    {
      name: 'Ações',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];

  listOfData: PaymentData[] = [];
  courses: PaymentsModel[] = [];

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.getCrouses();
  }

  async getCrouses() {
    this.loading = true;
    try {
      const rawData = await this.courseService.getPayments(null);

      this.listOfData = rawData.map((item: any) => ({
        date: new Date(item.Emition),
        description: item.Description,
        paymentMethod: this.formatMethod(item.Method),
        value: item.Value,
        status: this.mapStatus(item.Status),
      }));

      this.courses = rawData;
    } catch (error) {
      console.error('Erro ao buscar pagamentos', error);
    } finally {
      this.loading = false;
    }
  }

  private mapStatus(apiStatus: string): 'Pago' | 'Pendente' | 'Cancelado' {
    const status = apiStatus.toLowerCase();

    if (status === 'RECEIVED' || status === 'APROVED' || 'PAID') return 'Pago';
    if (status === 'CANCELED' || status === 'CANCELLED') return 'Cancelado';
    return 'Pendente';
  }

  private formatMethod(method: string): string {
    if (!method) return '';
    if (method.toLowerCase() === 'pix') return 'PIX';
    return method.charAt(0).toUpperCase() + method.slice(1);
  }

  trackByColumn(index: number, column: ColumnItem): any {
    return column.name;
  }

  trackByData(index: number, data: PaymentData): any {
    return `${data.date}-${data.description}`;
  }

  printPayment(payment: any): void {
    console.log('Imprimindo pagamento:', payment);
    window.print();
  }
}
