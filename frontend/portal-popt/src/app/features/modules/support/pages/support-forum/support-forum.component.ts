import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService, ForumTopic } from '../../services/support.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-support-forum',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support-forum.component.html',
  styleUrl: './support-forum.component.scss'
})
export class SupportForumComponent implements OnInit {
  private supportService = inject(SupportService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  topics: ForumTopic[] = [];
  isLoading = true;

  showTopicModal = false;
  selectedTopic: any | null = null;
  isReplying = false;
  replyForm!: FormGroup;

  ngOnInit(): void {
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.loadTopics();
  }

  loadTopics(): void {
    this.isLoading = true;
    this.supportService.getForumTopics().subscribe({
      next: (data) => {
        this.topics = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Não foi possível carregar os tópicos do fórum.');
        this.isLoading = false;
      }
    });
  }

  openTopicModal(topic: any): void {
    // Carrega os detalhes completos com mensagens
    this.supportService.getForumTopicById(topic.id).subscribe({
      next: (fullTopic) => {
        this.selectedTopic = fullTopic;
        this.showTopicModal = true;
        this.replyForm.reset();
      },
      error: () => {
        this.toastService.error('Erro ao carregar detalhes do tópico.');
      }
    });
  }

  closeModal(): void {
    this.showTopicModal = false;
    this.selectedTopic = null;
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.selectedTopic) return;

    this.isReplying = true;
    const content = this.replyForm.value.content;

    this.supportService.replyForumTopic(this.selectedTopic.id, content).subscribe({
      next: (res) => {
        this.toastService.success('Resposta publicada no fórum com sucesso!');
        // O backend retorna apenas { id }. Precisamos adicionar a msg na lista atual.
        this.selectedTopic.messages.push({
          id: res.id,
          content: content,
          authorName: 'Suporte',
          createdAt: new Date().toISOString()
        });
        
        // Atualiza a contagem na listagem geral
        const index = this.topics.findIndex(t => t.id === this.selectedTopic!.id);
        if (index > -1) this.topics[index].repliesCount++;
        
        this.replyForm.reset();
        this.isReplying = false;
      },
      error: () => {
        this.toastService.error('Não foi possível publicar a resposta.');
        this.isReplying = false;
      }
    });
  }

  changeStatus(newStatus: 'Open' | 'Resolved'): void {
    if (!this.selectedTopic) return;
    
    this.supportService.updateForumTopicStatus(this.selectedTopic.id, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status alterado com sucesso.`);
        this.selectedTopic!.status = newStatus;
        const index = this.topics.findIndex(t => t.id === this.selectedTopic!.id);
        if (index > -1) this.topics[index].status = newStatus;
      },
      error: () => {
        this.toastService.error('Não foi possível alterar o status do tópico.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Open': return 'bg-info bg-opacity-10 text-info border-info';
      case 'Resolved': return 'bg-success bg-opacity-10 text-success border-success';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary';
    }
  }
}
