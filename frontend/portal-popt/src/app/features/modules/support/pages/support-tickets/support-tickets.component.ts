import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService, SupportTicket } from '../../services/support.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.scss'
})
export class SupportTicketsComponent implements OnInit {
  private supportService = inject(SupportService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  selectedTicket: SupportTicket | null = null;
  isLoading = true;
  isReplying = false;

  replyForm!: FormGroup;
  searchQuery = '';
  statusFilter = '';

  ngOnInit(): void {
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.supportService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Não foi possível carregar os chamados.');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            t.userName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter ? t.status === this.statusFilter : true;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(event: any): void {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }

  selectTicket(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
    this.replyForm.reset();
  }

  closeTicketView(): void {
    this.selectedTicket = null;
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.selectedTicket) return;

    this.isReplying = true;
    const content = this.replyForm.value.content;

    this.supportService.replyTicket(this.selectedTicket.id, content).subscribe({
      next: (updatedTicket) => {
        this.toastService.success('Resposta enviada com sucesso!');
        this.selectedTicket = updatedTicket;
        const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
        if (index > -1) this.tickets[index] = updatedTicket;
        this.applyFilters();
        this.replyForm.reset();
        this.isReplying = false;
      },
      error: () => {
        this.toastService.error('Não foi possível enviar a resposta.');
        this.isReplying = false;
      }
    });
  }

  changeStatus(newStatus: 'Pendente' | 'Respondido' | 'Cancelado' | 'Finalizado'): void {
    if (!this.selectedTicket) return;
    
    this.supportService.updateTicketStatus(this.selectedTicket.id, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status alterado para ${newStatus}.`);
        this.selectedTicket!.status = newStatus;
        const index = this.tickets.findIndex(t => t.id === this.selectedTicket!.id);
        if (index > -1) this.tickets[index].status = newStatus;
        this.applyFilters();
      },
      error: () => {
        this.toastService.error('Não foi possível alterar o status.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pendente': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'Respondido': return 'bg-info bg-opacity-10 text-info border-info';
      case 'Finalizado': return 'bg-success bg-opacity-10 text-success border-success';
      case 'Cancelado': return 'bg-danger bg-opacity-10 text-danger border-danger';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  }
}
