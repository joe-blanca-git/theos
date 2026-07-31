import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
Chart.register(...registerables);

export interface DashboardKpi {
  title: string;
  value: string;
  icon: string;
  badge?: {
    text: string;
    type: 'success' | 'danger' | 'warning' | 'info';
  };
  auxText?: string;
}

export interface SummaryItem {
  label: string;
  value: string;
  icon: string;
}

export interface ForumTopic {
  course: string;
  lesson: string;
  title: string;
  author: string;
  date: string;
  status: 'Novo' | 'Respondido' | 'Fechado';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @Output() tabChange = new EventEmitter<string>();
  @Input() isLoadingPage: boolean = false;

  kpis: DashboardKpi[] = [
    { title: 'Cursos Vendidos', value: '1.248', icon: 'fas fa-book', badge: { text: '+12% este mês', type: 'success' } },
    { title: 'Faturamento Total', value: 'R$ 186.450,00', icon: 'fas fa-dollar-sign' },
    { title: 'Crescimento', value: '+18,7%', icon: 'fas fa-chart-line', auxText: 'Crescimento em relação ao mês anterior.' },
    { title: 'Alunos Ativos', value: '864', icon: 'fas fa-users' }
  ];

  summaryItems: SummaryItem[] = [
    { label: 'Receita hoje', value: 'R$ 1.840', icon: 'fas fa-money-bill-wave' },
    { label: 'Novos alunos', value: '46', icon: 'fas fa-user-plus' },
    { label: 'Cursos publicados', value: '8', icon: 'fas fa-video' },
    { label: 'Aulas publicadas', value: '142', icon: 'fas fa-play-circle' },
    { label: 'Mensagens pendentes', value: '17', icon: 'fas fa-envelope' },
    { label: 'Avaliação média', value: '⭐ 4,9', icon: 'fas fa-star' }
  ];

  forumTopics: ForumTopic[] = [
    { course: 'Caráter do Líder', lesson: 'A Verdadeira Autoridade', title: 'Como desenvolver intimidade com Deus?', author: 'João Silva', date: 'há 12 min', status: 'Novo' },
    { course: 'Caráter do Líder', lesson: 'Ordem, o Ambiente do Milagre', title: 'Como aplicar isso na liderança?', author: 'Maria Oliveira', date: 'há 35 min', status: 'Respondido' },
    { course: 'Teologia Sistemática', lesson: 'Cristologia', title: 'Jesus possuía duas naturezas?', author: 'Pedro Santos', date: 'há 1 hora', status: 'Novo' },
    { course: 'Liderança Cristã', lesson: 'Comunicação', title: 'O poder das palavras', author: 'Ana Souza', date: 'há 2 horas', status: 'Respondido' },
    { course: 'Caráter do Líder', lesson: 'Permanecer no Caminho', title: 'Como vencer a procrastinação?', author: 'Lucas Lima', date: 'Ontem', status: 'Novo' }
  ];

  public lineChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        data: [9800, 12400, 15700, 18100, 19500, 21200, 22800, 24100, 25700, 26900, 28400, 31850],
        label: 'Faturamento (R$)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 0.8)',
        fill: 'origin',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        border: { display: false },
        ticks: { color: '#9ca3af' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  ngOnInit() { }
}
