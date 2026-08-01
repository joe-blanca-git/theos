import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { SupportService, ISupportTicket, ISupportTicketDetails } from '../../../../../core/services/support.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.scss'
})
export class SupportTicketsComponent implements OnInit {
  private supportService = inject(SupportService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  tickets: ISupportTicket[] = [];
  filteredTickets: ISupportTicket[] = [];
  selectedTicket: ISupportTicketDetails | null = null;
  isLoading = true;
  isReplying = false;

  replyForm!: FormGroup;
  searchQuery = '';
  statusFilter = '';

  // Novo Chamado Modal
  showNewTicketModal = false;
  ticketCategories: any[] = [];
  contactCategoryId: number | null = null;
  contactSubject = '';
  contactMessage = '';
  isCreatingTicket = false;

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
        this.tickets = data.items;
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
      const matchesSearch = t.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            t.categoryName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter ? t.status === this.statusFilter : true;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(event: any): void {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }

  selectTicket(ticket: ISupportTicket): void {
    this.supportService.getTicketDetails(ticket.id).subscribe({
      next: (details) => {
        this.selectedTicket = details;
        this.replyForm.reset();
      },
      error: () => this.toastService.error('Erro ao carregar os detalhes do chamado.')
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
        // Refresh ticket details
        this.selectTicket(this.selectedTicket as any);
        this.replyForm.reset();
        this.isReplying = false;
      },
      error: () => {
        this.toastService.error('Não foi possível enviar a resposta.');
        this.isReplying = false;
      }
    });
  }

  changeStatus(status: string): void {
    // Disabled in portal-pat
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case '0': return 'bg-warning text-dark'; // Aberto
      case '1': return 'bg-info text-white'; // Pendente
      case '2': return 'bg-primary text-white'; // EmAndamento
      case '3': return 'bg-success text-white'; // Fechado
      default: return 'bg-secondary text-white';
    }
  }

  isSupportMessage(msg: any): boolean {
    return msg.origin !== 'Portal';
  }

  // ─── Novo Chamado Modal ──────────────────────────────────────────────────
  openNewTicketModal(): void {
    if (this.ticketCategories.length === 0) {
      this.supportService.getCategories().subscribe(cats => {
        this.ticketCategories = cats;
        if (cats.length > 0) this.contactCategoryId = cats[0].id;
      });
    }
    this.showNewTicketModal = true;
  }

  closeNewTicketModal(): void {
    this.showNewTicketModal = false;
    this.contactSubject = '';
    this.contactMessage = '';
  }

  submitNewTicket(event: Event): void {
    event.preventDefault();
    if (!this.contactSubject.trim() || !this.contactMessage.trim() || !this.contactCategoryId) {
      this.toastService.error('Preencha os campos obrigatórios.');
      return;
    }
    
    this.isCreatingTicket = true;
    this.supportService.createTicket({
      categoryId: this.contactCategoryId,
      subject: this.contactSubject,
      content: this.contactMessage
    }).subscribe({
      next: () => {
        this.toastService.success('Chamado aberto com sucesso!');
        this.closeNewTicketModal();
        this.isCreatingTicket = false;
        this.loadTickets(); // recarregar a lista
      },
      error: () => {
        this.toastService.error('Erro ao abrir chamado.');
        this.isCreatingTicket = false;
      }
    });
  }
}
