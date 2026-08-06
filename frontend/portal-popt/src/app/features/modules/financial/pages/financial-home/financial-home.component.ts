import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../services/financial.service';
import { FinancialDashboardSummaryDto, FinancialClosingSimulationDto } from '../../models/financial.model';

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
  
  // States
  isLoadingSummary: boolean = true;
  isLoadingGrid: boolean = true;
  
  // Data
  summary: FinancialDashboardSummaryDto | null = null;
  simulation: FinancialClosingSimulationDto | null = null;
  
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
    this.onSearch();
  }

  loadData() {
    this.isLoadingSummary = true;
    
    this.financialService.getDashboardSummary().subscribe(res => {
      this.summary = res;
      this.isLoadingSummary = false;
    });

    this.loadGrid();
  }

  loadGrid() {
    this.isLoadingGrid = true;
    
    this.financialService.simulateClosing().subscribe(res => {
      this.simulation = res;
      this.isLoadingGrid = false;
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
  }

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

  // Ações Grid
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
    this.financialService.simulateClosing().subscribe(res => {
      this.closingData = {
        professorName: this.closingProfessorId === '1' ? 'Professor João' : 'Professora Maria',
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

  generateDemonstrativo() {
    alert('Simulação: Demonstrativo gerado com sucesso! Um PDF fictício foi baixado.');
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

  // Helpers de UI
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmado': return 'bg-success bg-opacity-10 text-success border-success';
      case 'Pendente': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'Cancelado': return 'bg-danger bg-opacity-10 text-danger border-danger';
      case 'Reembolsado': return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
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
