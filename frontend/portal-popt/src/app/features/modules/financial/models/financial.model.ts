export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Crédito Parcelado' | 'Boleto';
export type PaymentStatus = 'Confirmado' | 'Pendente' | 'Cancelado' | 'Reembolsado';

export interface SaleTransaction {
  id: string;
  transactionCode: string;
  purchaseDate: string;
  confirmationDate: string | null;
  studentName: string;
  courseName: string;
  professors: { name: string; percentage: number; value: number }[];
  paymentMethod: PaymentMethod;
  installments: number;
  grossValue: number;
  bankFeePercentage: number;
  bankFeeValue: number;
  theosFeePercentage: number;
  theosFeeValue: number;
  netValue: number;
  professorsValue: number;
  paymentStatus: PaymentStatus;
  saleStatus: PaymentStatus;
}

export interface FinancialSummary {
  totalSalesCount: number;
  totalConfirmedCount: number;
  totalCancelledCount: number;
  totalRefundedCount: number;
  grossRevenue: number;
  netRevenue: number;
  professorsTotal: number;
  theosTotal: number;
  growth: {
    totalSales: number;
    confirmed: number;
    cancelled: number;
    refunded: number;
    gross: number;
    net: number;
    professors: number;
    theos: number;
  };
}

export interface ProfessorClosing {
  professorId: string;
  professorName: string;
  periodStart: string;
  periodEnd: string;
  salesCount: number;
  grossRevenue: number;
  confirmedValue: number;
  cancelledValue: number;
  refundedValue: number;
  bankFees: number;
  theosFees: number;
  netValue: number;
  totalToReceive: number;
  sales: SaleTransaction[];
}
