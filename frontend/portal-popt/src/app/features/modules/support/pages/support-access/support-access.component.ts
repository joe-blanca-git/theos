import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportService, UserAccess, PurchasedCourse } from '../../services/support.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-support-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-access.component.html',
  styleUrl: './support-access.component.scss'
})
export class SupportAccessComponent implements OnInit {
  private supportService = inject(SupportService);
  private toastService = inject(ToastService);

  users: UserAccess[] = [];
  filteredUsers: UserAccess[] = [];
  selectedUser: UserAccess | null = null;
  
  isLoading = true;
  searchQuery = '';
  
  showConfirmModal = false;
  courseToGrant: PurchasedCourse | null = null;
  isGranting = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.supportService.getUsersAccess().subscribe({
      next: (data) => {
        this.users = data;
        this.applySearch();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Não foi possível carregar a lista de acesso.');
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.applySearch();
  }

  applySearch(): void {
    this.filteredUsers = this.users
      .filter(u => 
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  selectUser(user: UserAccess): void {
    this.selectedUser = user;
  }

  getPaymentBadgeClass(status: string): string {
    switch (status) {
      case 'Pago': return 'bg-success bg-opacity-10 text-success border-success';
      case 'Pendente': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'Cancelado': return 'bg-danger bg-opacity-10 text-danger border-danger';
      case 'Reembolsado': return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
      default: return 'bg-light text-secondary border-secondary';
    }
  }

  getAccessBadgeClass(status: string): string {
    return status === 'Liberado' 
      ? 'bg-success bg-opacity-10 text-success border-success' 
      : 'bg-danger bg-opacity-10 text-danger border-danger';
  }

  openGrantModal(course: PurchasedCourse): void {
    this.courseToGrant = course;
    this.showConfirmModal = true;
  }

  closeGrantModal(): void {
    this.showConfirmModal = false;
    this.courseToGrant = null;
  }

  confirmGrantAccess(): void {
    if (!this.selectedUser || !this.courseToGrant) return;

    this.isGranting = true;
    this.supportService.grantCourseAccess(this.selectedUser.id, this.courseToGrant.id).subscribe({
      next: (updatedUser) => {
        this.toastService.success('Curso liberado com sucesso!');
        // Update local reference to immediately reflect changes
        this.courseToGrant!.accessStatus = 'Liberado';
        this.isGranting = false;
        this.closeGrantModal();
      },
      error: () => {
        this.toastService.error('Ocorreu um erro ao tentar liberar o curso.');
        this.isGranting = false;
        this.closeGrantModal();
      }
    });
  }
}
