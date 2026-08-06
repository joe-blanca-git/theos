import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../services/financial.service';
import { FinancialSummary, ProfessorClosing, SaleTransaction } from '../../models/financial.model';

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
  summary: FinancialSummary | null = null;
  sales: SaleTransaction[] = [];
  totalSales: number = 0;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Modals state
  showSaleModal: boolean = false;
  selectedSale: SaleTransaction | null = null;
  
  showClosingModal: boolean = false;
  closingProfessorId: string = '';
  isProcessingClosing: boolean = false;
  closingData: ProfessorClosing | null = null;

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
    this.isLoadingGrid = true;
    
    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);

    this.financialService.getDashboardSummary(start, end).subscribe(res => {
      this.summary = res;
      this.isLoadingSummary = false;
    });

    this.loadGrid();
  }

  loadGrid() {
    this.isLoadingGrid = true;
    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);
    
    this.financialService.getSales(start, end, this.currentPage, this.pageSize).subscribe(res => {
      this.sales = res.data;
      this.totalSales = res.total;
      this.isLoadingGrid = false;
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    this.loadGrid();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalSales / this.pageSize);
  }
  
  getPageArray(): number[] {
    return Array(this.getTotalPages()).fill(0).map((x, i) => i + 1);
  }

  // Ações Grid
  openSaleModal(sale: SaleTransaction) {
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
    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);
    
    this.financialService.processProfessorClosing(this.closingProfessorId, start, end).subscribe(res => {
      this.closingData = res;
      this.isProcessingClosing = false;
    });
  }

  generateDemonstrativo() {
    alert('Simulação: Demonstrativo gerado com sucesso! Um PDF fictício foi baixado.');
  }

  confirmClosing() {
    alert('Simulação: Fechamento financeiro confirmado no sistema!');
    this.closeClosingModal();
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
