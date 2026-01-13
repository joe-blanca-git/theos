import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { FormsModule } from '@angular/forms';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LatestCoursesModel } from '../../models/courses.model';
import { CoursesService } from '../../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ava-home',
  standalone: true,
  imports: [CommonModule, MovieListComponent, FormsModule, NzCarouselModule],
  templateUrl: './ava-home.component.html',
  styleUrls: ['./ava-home.component.scss','../../ava.app.component.scss'],
})
export class AvaHomeComponent {
  titlePage = 'AVAT - Área Virtual do Aluno Theos';
  descriptionPage = 'Desempenho, Cursos e Certificados!';
  dotPosition = 'bottom';
  array = [1, 2, 3, 4];
  loading = false;

  home = {
    user: 'Joeder Blanca',
    coursesQty: 4,
    progressPerc: '65%',
    forum: 4,
    forumNew: 2,
    certifieds: 1,
    categories: [
      {
        name: 'Pregação',
        id: 1,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2dPnWWRJaGWZhul_msw4R3GCzUye-ZV7zbQ&s',
      },
      {
        name: 'Mídia',
        id: 2,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhjl2NWEXlVTi8dYFa8-BwOW_s5B0D7G2gBQ&s',
      },
    ],
  };

  cards: any[] = [];

  listLatestCourses: LatestCoursesModel[] = [];
  listTopThenCourses: LatestCoursesModel[] = [];
  listCategoriesCourses: any[] = [];

  constructor(private router: Router, private courseService: CoursesService) {}

  ngOnInit(): void {
    this.cards = [
      {
        title: 'Meus Cursos',
        icon: 'fa fa-book',
        value: this.home.coursesQty,
      },
      {
        title: 'Progresso',
        icon: 'fa fa-chart-line',
        value: this.home.progressPerc,
      },
      {
        title: 'Fórum',
        icon: 'fa fa-comments',
        value: this.home.forum,
        badge: this.home.forumNew,
      },
    ];

    this.loadData();
  }

  async loadData() {
    this.loading = true;

    try {
      await this.getLatest();
      await this.getTopThen();
      await this.getCategories();
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  async getLatest() {
    this.listLatestCourses = await this.courseService.getLatestCourses();
  }

  async getTopThen() {
    this.listTopThenCourses = await this.courseService.getTopThen();
  }

  getCategories() {
    const map = new Map<number, { name: string; cover: string }>();

    this.listLatestCourses.forEach((e) => {
      if (!map.has(e.CategoryId)) {
        map.set(e.CategoryId, {
          name: e.Category,
          cover: e.CategoryCover,
        });
      }
    });

    this.listCategoriesCourses = Array.from(map, ([id, value]) => ({
      id,
      name: value.name,
      cover: value.cover,
    }));
  }

  navigateToCourse(courseId: number) {
    this.router.navigate(['/avat/course-detail'], {
      queryParams: { course: courseId },
    });
  }
}
