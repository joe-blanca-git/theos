import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../services/financial.service';
import { FinancialDashboardSummaryDto, FinancialClosingSimulationDto, RefundDashboardSummaryDto, RefundRequestDto, RefundStatus } from '../../models/financial.model';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-financial-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-home.component.html',
  styleUrl: './financial-home.component.scss'
})
export class FinancialHomeComponent implements OnInit {

  // Filters
  filterStartDate: string = '';
  filterEndDate: string = '';
  activeTab: 'vendas' | 'reembolsos' = 'vendas';

  // --- REEMBOLSOS STATE ---
  filterRefundStatus: RefundStatus = 'Todos';
  refundSearchTerm: string = '';
  isLoadingRefundSummary: boolean = true;
  isLoadingRefunds: boolean = true;
  refundSummary: RefundDashboardSummaryDto | null = null;
  refunds: RefundRequestDto[] = [];
  refundCurrentPage: number = 1;
  refundPageSize: number = 10;
  
  // Refund Modals state
  showRefundDrawer: boolean = false;
  selectedRefund: RefundRequestDto | null = null;
  showApproveConfirm: boolean = false;
  showRejectConfirm: boolean = false;
  showExecuteConfirm: boolean = false;
  rejectReason: string = '';
  isProcessingAction: boolean = false;
  // -------------------------
  
  // States
  isLoadingSummary: boolean = true;
  isLoadingGrid: boolean = true;
  
  // Data
  summary: FinancialDashboardSummaryDto | null = null;
  simulation: FinancialClosingSimulationDto | null = null;
  teachers: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Modals state
  showSaleModal: boolean = false;
  selectedSale: any = null;
  
  showClosingModal: boolean = false;
  closingProfessorId: string = '';
  isProcessingClosing: boolean = false;
  closingData: any = null;
  isGeneratingPdf: boolean = false;
  currentDate = new Date();

  @ViewChild('pdfContent') pdfContent!: ElementRef;

  constructor(private financialService: FinancialService) {}

  ngOnInit() {
    this.initDefaultDates();
    this.loadData();
  }

  initDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.filterStartDate = firstDay.toISOString().split('T')[0];
    this.filterEndDate = lastDay.toISOString().split('T')[0];
  }

  onSearch() {
    this.currentPage = 1;
    this.loadData();
  }

  onClearFilters() {
    this.initDefaultDates();
    if (this.activeTab === 'reembolsos') {
      this.filterRefundStatus = 'Todos';
      this.refundSearchTerm = '';
    }
    this.onSearch();
  }

  switchTab(tab: 'vendas' | 'reembolsos') {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.initDefaultDates();
    if (tab === 'reembolsos') {
      this.filterRefundStatus = 'Todos';
      this.refundSearchTerm = '';
    }
    this.onSearch();
  }

  loadData() {
    if (this.activeTab === 'vendas') {
      this.loadVendasData();
    } else {
      this.loadRefundsData();
    }
  }

  loadVendasData() {
    this.isLoadingSummary = true;
    
    this.financialService.getDashboardSummary().subscribe(res => {
      this.summary = res;
      this.isLoadingSummary = false;
    });

    this.financialService.getTeachers().subscribe(res => {
      this.teachers = res;
    });

    this.loadGrid();
  }

  loadRefundsData() {
    this.isLoadingRefundSummary = true;
    this.financialService.getRefundSummary(this.filterStartDate, this.filterEndDate).subscribe({
      next: res => {
        this.refundSummary = res;
        this.isLoadingRefundSummary = false;
      },
      error: () => {
        // Mock fallback to empty summary if endpoint isn't ready
        this.refundSummary = { totalPending: 0, totalApproved: 0, totalProcessing: 0, totalRefunded: 0, totalRefundedValue: 0 };
        this.isLoadingRefundSummary = false;
      }
    });
    this.loadRefundsGrid();
  }

  loadRefundsGrid() {
    this.isLoadingRefunds = true;
    const filters = {
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      status: this.filterRefundStatus,
      search: this.refundSearchTerm
    };
    this.financialService.getRefunds(filters).subscribe({
      next: res => {
        this.refunds = res;
        this.isLoadingRefunds = false;
      },
      error: () => {
        this.refunds = [];
        this.isLoadingRefunds = false;
      }
    });
  }

  loadGrid() {
    this.isLoadingGrid = true;
    
    this.financialService.simulateClosing().subscribe(res => {
      this.simulation = res;
      this.isLoadingGrid = false;
    });
  }

  changePage(page: number) {
    if (this.activeTab === 'vendas') {
      if (page < 1 || page > this.getTotalPages()) return;
      this.currentPage = page;
    } else {
      if (page < 1 || page > this.getRefundTotalPages()) return;
      this.refundCurrentPage = page;
    }
  }

  // --- Pagination Vendas ---
  getTotalPages(): number {
    if (!this.simulation) return 1;
    return Math.ceil(this.simulation.items.length / this.pageSize);
  }
  
  getPageArray(): number[] {
    return Array(this.getTotalPages()).fill(0).map((x, i) => i + 1);
  }
  
  getPaginatedItems() {
    if (!this.simulation) return [];
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.simulation.items.slice(startIndex, startIndex + this.pageSize);
  }

  // --- Pagination Reembolsos ---
  getRefundTotalPages(): number {
    return Math.ceil(this.refunds.length / this.refundPageSize) || 1;
  }
  
  getRefundPageArray(): number[] {
    return Array(this.getRefundTotalPages()).fill(0).map((x, i) => i + 1);
  }
  
  getPaginatedRefunds() {
    const startIndex = (this.refundCurrentPage - 1) * this.refundPageSize;
    return this.refunds.slice(startIndex, startIndex + this.refundPageSize);
  }

  // --- Ações Vendas ---
  openSaleModal(sale: any) {
    this.selectedSale = sale;
    this.showSaleModal = true;
  }

  closeSaleModal() {
    this.showSaleModal = false;
    this.selectedSale = null;
  }

  // Ações Fechamento
  openClosingModal() {
    this.showClosingModal = true;
    this.closingProfessorId = '';
    this.closingData = null;
  }

  closeClosingModal() {
    this.showClosingModal = false;
    this.closingProfessorId = '';
    this.closingData = null;
  }

  onSelectProfessorForClosing() {
    if (!this.closingProfessorId) {
      this.closingData = null;
      return;
    }
    
    this.isProcessingClosing = true;
    
    // Na integraçao real, admin tem um endpoit POST. Mas a nível de interface, mockamos o calculo caso não seja o user logado.
    // Usaremos a própria simulação que já puxa os valores pra mostrar na modal do admin.
    const selectedTeacher = this.teachers.find(t => t.id === +this.closingProfessorId);

    this.financialService.simulateClosing().subscribe(res => {
      this.closingData = {
        professorName: selectedTeacher ? selectedTeacher.name : 'Professor',
        salesCount: res.items.length,
        grossRevenue: res.grossRevenue,
        bankFees: res.bankFeesTotal,
        theosFees: res.theosFeesTotal,
        totalToReceive: res.totalToReceive,
        sales: res.items
      };
      this.isProcessingClosing = false;
    });
  }



  confirmClosing() {
    if (!this.closingProfessorId) return;
    
    this.financialService.processClosing(+this.closingProfessorId).subscribe({
      next: (res) => {
        alert('Fechamento gerado com sucesso! Lote: ' + res.id);
        this.closeClosingModal();
        this.loadData(); // reload dashboard
      },
      error: (err) => {
        alert('Erro ao processar fechamento: ' + err.error?.message);
      }
    });
  }

  async generateDemonstrativo() {
    if (!this.closingData || !this.pdfContent) return;
    
    this.isGeneratingPdf = true;
    
    try {
      const element = this.pdfContent.nativeElement;
      
      // Temporarily unhide to capture
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true, // For the logo image
        logging: false
      });
      
      element.style.display = 'none'; // Hide again

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Demonstrativo_${this.closingData.professorName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF', error);
      alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  // --- AÇÕES REEMBOLSO ---

  openAnalyzeDrawer(refund: RefundRequestDto) {
    this.selectedRefund = refund;
    this.showRefundDrawer = true;
  }

  closeAnalyzeDrawer() {
    this.showRefundDrawer = false;
    this.selectedRefund = null;
  }

  openApproveConfirm() { this.showApproveConfirm = true; }
  closeApproveConfirm() { this.showApproveConfirm = false; }
  
  openRejectConfirm() { 
    this.rejectReason = '';
    this.showRejectConfirm = true; 
  }
  closeRejectConfirm() { this.showRejectConfirm = false; }

  openExecuteConfirm() { this.showExecuteConfirm = true; }
  closeExecuteConfirm() { this.showExecuteConfirm = false; }

  confirmApproveRefund() {
    if (!this.selectedRefund) return;
    this.isProcessingAction = true;
    this.financialService.approveRefund(this.selectedRefund.id).subscribe({
      next: () => {
        alert('Reembolso aprovado com sucesso!');
        this.isProcessingAction = false;
        this.closeApproveConfirm();
        this.closeAnalyzeDrawer();
        this.loadRefundsData();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao aprovar reembolso.');
        this.isProcessingAction = false;
        this.closeApproveConfirm();
      }
    });
  }

  confirmRejectRefund() {
    if (!this.selectedRefund || !this.rejectReason.trim()) return;
    this.isProcessingAction = true;
    this.financialService.rejectRefund(this.selectedRefund.id, this.rejectReason).subscribe({
      next: () => {
        alert('Reembolso reprovado.');
        this.isProcessingAction = false;
        this.closeRejectConfirm();
        this.closeAnalyzeDrawer();
        this.loadRefundsData();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao reprovar reembolso.');
        this.isProcessingAction = false;
        this.closeRejectConfirm();
      }
    });
  }

  confirmExecuteRefund() {
    if (!this.selectedRefund) return;
    this.isProcessingAction = true;
    this.financialService.executeRefund(this.selectedRefund.id).subscribe({
      next: () => {
        alert('Reembolso enviado para processamento!');
        this.isProcessingAction = false;
        this.closeExecuteConfirm();
        this.closeAnalyzeDrawer();
        this.loadRefundsData();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao executar reembolso. Verifique logs do Asaas.');
        this.isProcessingAction = false;
        this.closeExecuteConfirm();
      }
    });
  }

  // Helpers de UI
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmado': 
      case 'Aprovado':
        return 'bg-success bg-opacity-10 text-success border-success';
      case 'Pendente': 
        return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'Cancelado': 
      case 'Reprovado':
      case 'Falha':
        return 'bg-danger bg-opacity-10 text-danger border-danger';
      case 'Reembolsado': 
        return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
      case 'Processando':
        return 'bg-primary bg-opacity-10 text-primary border-primary';
      default: return 'bg-light text-dark';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
  
  formatPercent(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value);
  }
}
