import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { LatestCoursesModel } from '../../models/courses.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NzRateModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent {
  @Input() listCourses: LatestCoursesModel[] = [];

  @Output() courseSelected = new EventEmitter<number>();

  secondsToMinutes(seconds: number): number {
    if (!seconds || seconds < 0) {
      return 0;
    }

    return Math.floor(seconds / 60);
  }

  selectCourse(courseId: number): void {
    this.courseSelected.emit(courseId);
  }
}
