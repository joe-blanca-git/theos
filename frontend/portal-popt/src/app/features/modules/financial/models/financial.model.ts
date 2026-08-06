export interface FinancialDashboardSummaryDto {
  totalAvailable: number;
  totalPending: number;
  totalWithdrawn: number;
}

export interface FinancialClosingItemSimulationDto {
  purchaseId: number;
  courseName: string;
  studentName: string;
  purchaseDate: string;
  paymentMethod: string;
  appliedTeacherPercentage: number;
  grossValue: number;
  bankFeeValue: number;
  theosFeeValue: number;
  calculatedValue: number;
}

export interface FinancialClosingSimulationDto {
  grossRevenue: number;
  bankFeesTotal: number;
  theosFeesTotal: number;
  netValue: number;
  totalToReceive: number;
  items: FinancialClosingItemSimulationDto[];
}
