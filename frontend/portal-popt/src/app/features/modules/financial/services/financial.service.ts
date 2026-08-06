import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FinancialSummary, ProfessorClosing, SaleTransaction } from '../models/financial.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor() { }

  getDashboardSummary(startDate: Date, endDate: Date): Observable<FinancialSummary> {
    const summary: FinancialSummary = {
      totalSalesCount: 1542,
      totalConfirmedCount: 1400,
      totalCancelledCount: 100,
      totalRefundedCount: 42,
      grossRevenue: 450000,
      netRevenue: 420000,
      professorsTotal: 250000,
      theosTotal: 170000,
      growth: {
        totalSales: 15.2,
        confirmed: 12.5,
        cancelled: -5.0,
        refunded: 2.1,
        gross: 18.4,
        net: 19.1,
        professors: 14.5,
        theos: 20.2
      }
    };
    return of(summary).pipe(delay(800)); // Simulate network latency
  }

  getSales(startDate: Date, endDate: Date, page: number = 1, pageSize: number = 10): Observable<{data: SaleTransaction[], total: number}> {
    const mockSales = this.generateMockSales(25);
    const startIdx = (page - 1) * pageSize;
    const data = mockSales.slice(startIdx, startIdx + pageSize);
    return of({ data, total: mockSales.length }).pipe(delay(800));
  }

  processProfessorClosing(professorId: string, startDate: Date, endDate: Date): Observable<ProfessorClosing> {
    const mockSales = this.generateMockSales(15).filter(s => s.professors.some(p => p.name === 'Professor João' || p.name === 'Professora Maria'));
    
    // Simulate calculation
    let grossRevenue = 0;
    let confirmedValue = 0;
    let cancelledValue = 0;
    let refundedValue = 0;
    let bankFees = 0;
    let theosFees = 0;
    let totalToReceive = 0;

    mockSales.forEach(sale => {
      grossRevenue += sale.grossValue;
      if (sale.paymentStatus === 'Confirmado') confirmedValue += sale.grossValue;
      if (sale.paymentStatus === 'Cancelado') cancelledValue += sale.grossValue;
      if (sale.paymentStatus === 'Reembolsado') refundedValue += sale.grossValue;
      
      bankFees += sale.bankFeeValue;
      theosFees += sale.theosFeeValue;
      
      const prof = sale.professors.find(p => p.name.includes('João') || p.name.includes('Maria'));
      if(prof) totalToReceive += prof.value;
    });

    const closing: ProfessorClosing = {
      professorId: professorId,
      professorName: professorId === '1' ? 'Professor João' : 'Professora Maria',
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
      salesCount: mockSales.length,
      grossRevenue,
      confirmedValue,
      cancelledValue,
      refundedValue,
      bankFees,
      theosFees,
      netValue: grossRevenue - bankFees,
      totalToReceive,
      sales: mockSales
    };

    return of(closing).pipe(delay(1200));
  }

  private generateMockSales(count: number): SaleTransaction[] {
    const sales: SaleTransaction[] = [];
    const courses = ['Caráter do Líder', 'Teologia Sistemática', 'Liderança Cristã', 'Aconselhamento Bíblico'];
    const students = ['Joeder Blanca', 'Lucas Silva', 'Maria Oliveira', 'Ana Souza', 'Pedro Santos'];
    const paymentMethods: any[] = ['PIX', 'Cartão de Crédito', 'Cartão de Crédito Parcelado', 'Boleto'];
    const statuses: any[] = ['Confirmado', 'Confirmado', 'Confirmado', 'Pendente', 'Cancelado', 'Reembolsado'];
    
    for (let i = 1; i <= count; i++) {
      const grossValue = Math.floor(Math.random() * (997 - 197 + 1)) + 197;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      let bankFeePercentage = 0;
      if (paymentMethod === 'PIX') bankFeePercentage = 0.0199;
      else if (paymentMethod === 'Boleto') bankFeePercentage = 0.025;
      else if (paymentMethod === 'Cartão de Crédito') bankFeePercentage = 0.029;
      else bankFeePercentage = 0.045; // Parcelado
      
      const bankFeeValue = grossValue * bankFeePercentage;
      const theosFeePercentage = 0.35;
      const theosFeeValue = grossValue * theosFeePercentage;
      const netValue = grossValue - bankFeeValue;
      
      // Random 1 or 2 professors
      const profCount = Math.random() > 0.7 ? 2 : 1;
      const professorsValue = netValue - theosFeeValue;
      const professors = [];
      
      if (profCount === 1) {
        professors.push({ name: 'Professor João', percentage: 100, value: professorsValue });
      } else {
        professors.push({ name: 'Professor João', percentage: 60, value: professorsValue * 0.6 });
        professors.push({ name: 'Professora Maria', percentage: 40, value: professorsValue * 0.4 });
      }
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      sales.push({
        id: i.toString(),
        transactionCode: `TX-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        purchaseDate: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toISOString(),
        confirmationDate: status === 'Confirmado' ? new Date().toISOString() : null,
        studentName: students[Math.floor(Math.random() * students.length)],
        courseName: courses[Math.floor(Math.random() * courses.length)],
        professors: professors,
        paymentMethod: paymentMethod,
        installments: paymentMethod === 'Cartão de Crédito Parcelado' ? Math.floor(Math.random() * 11) + 2 : 1,
        grossValue: grossValue,
        bankFeePercentage: bankFeePercentage,
        bankFeeValue: bankFeeValue,
        theosFeePercentage: theosFeePercentage,
        theosFeeValue: theosFeeValue,
        netValue: netValue,
        professorsValue: professorsValue,
        paymentStatus: status,
        saleStatus: status
      });
    }
    
    // Sort by date desc
    return sales.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  }
}
