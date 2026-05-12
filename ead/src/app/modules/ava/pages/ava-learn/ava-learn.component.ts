import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LearnLesson, playlist } from '../../models/courses.model';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-ava-learn',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ava-learn.component.html',
  styleUrls: ['./ava-learn.component.scss', '../../ava.app.component.scss'],
})
export class AvaLearnComponent implements OnInit {
  loading = false;
  lesson!: LearnLesson;
  videoUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CoursesService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.queryParamMap.get('course'));
    const moduleId = Number(this.route.snapshot.queryParamMap.get('module'));
    const lessonId = Number(this.route.snapshot.queryParamMap.get('lesson'));

    if (!courseId || !moduleId || !lessonId) {
      const queryParams: any = {
        course: courseId,
      };
      this.router.navigate(['/avat/course-detail'], { queryParams });
      return;
    }

    this.loading = true;

    this.courseService.getLearn(courseId, moduleId, lessonId).subscribe({
      next: (lesson) => {
        lesson.Playlist = lesson.Playlist.map((item) => ({
          ...item,
          Active: Number(item.LessonId) === lessonId,
        }));

        this.lesson = lesson;

        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          lesson.EmbedUrl,
        );

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSelectLesson(lesson: playlist): void {
    const courseId = Number(lesson.CourseId);
    const moduleId = Number(lesson.ModuleId);
    const lessonId = Number(lesson.LessonId);

    if (!courseId || !moduleId || !lessonId) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        course: courseId,
        module: moduleId,
        lesson: lessonId,
      },
      queryParamsHandling: 'merge',
    });

    this.loading = true;

    this.courseService.getLearn(courseId, moduleId, lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          lesson.EmbedUrl,
        );

        lesson.Playlist = lesson.Playlist.map((item) => ({
          ...item,
          Active: Number(item.LessonId) === lessonId,
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
