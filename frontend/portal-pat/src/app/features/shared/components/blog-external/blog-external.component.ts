import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILatestNews } from '../../../modules/home/models/home.model';
import { RouterModule } from '@angular/router';

export interface IPost {
  id?: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

@Component({
  selector: 'app-blog-external',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-external.component.html',
  styleUrl: './blog-external.component.scss'
})
export class BlogExternalComponent implements OnChanges {
  @Input() isLoadingPage: boolean = false;
  @Input() news: ILatestNews[] = [];

  featuredPost!: IPost;
  mediumPosts: IPost[] = [];
  smallPosts: IPost[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['news'] || changes['isLoadingPage']) {
      this.buildPosts();
    }
  }

  buildPosts() {
    if (this.isLoadingPage) {
      const dummy: IPost = { id: 0, title: '', excerpt: '', image: '', category: '', date: '' };
      this.featuredPost = dummy;
      this.mediumPosts = [dummy, dummy];
      this.smallPosts = [dummy, dummy, dummy, dummy];
      this.cdr.detectChanges();
      return;
    }

    // If no news, just render empty or placeholders
    if (!this.news || this.news.length === 0) {
      this.featuredPost = {
        id: 0,
        title: 'Nenhuma publicação',
        excerpt: 'Aguarde novas publicações.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzgb1b_n31TF86o9o091sQ3XSuhmIVdNUXbhKZRjOJauSTSVxv2-pSoU&s=10',
        category: 'Blog',
        date: ''
      };
      this.mediumPosts = [];
      this.smallPosts = [];
      return;
    }

    const mapToIPost = (n: ILatestNews): IPost => ({
      id: n.id,
      title: n.title,
      excerpt: n.subject || 'Sem resumo',
      image: n.headerImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzgb1b_n31TF86o9o091sQ3XSuhmIVdNUXbhKZRjOJauSTSVxv2-pSoU&s=10',
      category: n.tags ? n.tags.split(',')[0].trim() : 'Geral',
      date: new Date(n.publishDate).toLocaleDateString()
    });

    this.featuredPost = mapToIPost(this.news[0]);
    
    this.mediumPosts = this.news.slice(1, 3).map(mapToIPost);
    
    this.smallPosts = this.news.slice(3, 7).map(mapToIPost);

    this.cdr.detectChanges();
  }
}
