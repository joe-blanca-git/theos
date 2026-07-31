import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService, IAdminTicket, IAdminTicketDetails, IPaginatedList } from '../../services/support.service';
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

  tickets: IAdminTicket[] = [];
  selectedTicket: IAdminTicketDetails | null = null;
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
    this.supportService.getTickets(this.statusFilter || undefined, undefined, this.searchQuery || undefined).subscribe({
      next: (data) => {
        this.tickets = data.items;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Não foi possível carregar os chamados.');
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.loadTickets();
  }

  onFilterStatus(event: any): void {
    this.statusFilter = event.target.value;
    this.loadTickets();
  }

  selectTicket(ticket: IAdminTicket): void {
    this.supportService.getTicketDetails(ticket.id).subscribe({
      next: (details) => {
        this.selectedTicket = details;
        this.replyForm.reset();
      },
      error: () => {
        this.toastService.error('Erro ao carregar detalhes do chamado.');
      }
    });
  }

  closeTicketView(): void {
    this.selectedTicket = null;
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.selectedTicket) return;

    this.isReplying = true;
    const content = this.replyForm.value.content;

    this.supportService.replyTicket(this.selectedTicket.id, content).subscribe({
      next: () => {
        this.toastService.success('Resposta enviada com sucesso!');
        this.selectTicket(this.selectedTicket!);
        this.isReplying = false;
        this.loadTickets();
      },
      error: () => {
        this.toastService.error('Não foi possível enviar a resposta.');
        this.isReplying = false;
      }
    });
  }

  changeStatus(newStatus: string): void {
    if (!this.selectedTicket) return;
    
    this.supportService.updateTicketStatus(this.selectedTicket.id, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status alterado.`);
        this.selectedTicket!.status = newStatus;
        const index = this.tickets.findIndex(t => t.id === this.selectedTicket!.id);
        if (index > -1) this.tickets[index].status = newStatus;
      },
      error: () => {
        this.toastService.error('Não foi possível alterar o status.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case '1': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case '2': return 'bg-info bg-opacity-10 text-info border-info';
      case '3': return 'bg-primary bg-opacity-10 text-primary border-primary';
      case '4': return 'bg-success bg-opacity-10 text-success border-success';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  }
  
  getStatusName(status: string): string {
    switch (status) {
      case '1': return 'Aberto';
      case '2': return 'Pendente';
      case '3': return 'Respondido';
      case '4': return 'Finalizado';
      default: return 'Desconhecido';
    }
  }
}
