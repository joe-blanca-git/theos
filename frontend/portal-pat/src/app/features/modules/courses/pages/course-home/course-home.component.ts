import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CoursesService } from '../../services/courses.service';

export interface ICategory {
  id: number;
  name: string;
}

export interface ICourse {
  id: number;
  title: string;
  description: string;
  imgCoverLink: string;
  released: boolean;
  isComingSoon?: boolean;
  releaseDate?: string;
  color?: string;
  code?: string;
  rating?: number;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  categories?: ICategory[];
  hasPendingPurchase?: boolean;
}

@Component({
  selector: 'app-course-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-home.component.html',
  styleUrl: './course-home.component.scss'
})
export class CourseHomeComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Todos';

  categories: string[] = ['Todos', 'Tecnologia', 'Dados', 'Algoritmos', 'Infraestrutura', 'Design'];

  courses: ICourse[] = [];

  isLoading: boolean = true;

  constructor(
    private router: Router, 
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  async loadCourses() {
    this.isLoading = true;
    try {
      this.courses = await this.coursesService.getMyCourses();
      
      const extractedCategories = new Set<string>();
      this.courses.forEach(course => {
        if (course.categories && course.categories.length > 0) {
          course.categories.forEach(cat => extractedCategories.add(cat.name));
        }
      });
      
      this.categories = ['Todos', ...Array.from(extractedCategories)].sort((a, b) => {
        if (a === 'Todos') return -1;
        if (b === 'Todos') return 1;
        return a.localeCompare(b);
      });
    } catch (error) {
      console.error('Erro ao carregar cursos', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getFilteredCourses(): ICourse[] {
    return this.courses.filter(course => {
      const matchesCategory = this.selectedCategory === 'Todos' || 
                              (course.categories && course.categories.some(c => c.name === this.selectedCategory));
      const matchesSearch = course.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  navigateDetail(courseId: number) {
    this.router.navigate(['courses/course-detail', courseId]);
  }

  isCourseComingSoon(course: ICourse): boolean {
    if (!course.isComingSoon) return false;
    if (!course.releaseDate) return true; // Se não tem data, fica como coming soon eterno até mudarem a flag
    const today = new Date();
    const release = new Date(course.releaseDate);
    // Removemos as horas para comparar apenas os dias (ou compara com a hora atual, se desejar)
    return today < release;
  }

  onCourseAction(course: ICourse) {
    // Se estiver "Vem aí...", o usuário pode:
    // 1. Comprar (se não tiver comprado)
    // 2. Acessar os detalhes do curso (onde o botão de Iniciar Aula estará bloqueado)

    if (course.released) {
      this.navigateDetail(course.id);
    } else {
      this.router.navigate(['financial/cart', course.id]);
    }
  }
}
