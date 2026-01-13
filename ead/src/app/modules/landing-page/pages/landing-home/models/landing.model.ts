export interface LandingCoursesModel {
  Courses: Course[];
}

export interface Course {
  CodeCourse: number;
  CodeCloud: string;
  Title: string;
  DescriptionShort: string;
  DescriptionLarge: string;
  Poster: string;
  Cover: string;
  CodeCategory: number;
  NameCategory: string;
  DateRegister: string;
  Price: number;
  Author: string;
  AvatarAuthor: string;
  Status: string;
  SecondsDuration: number;
  Lessons: number;
  Students: number;
  Likes: number;
  Comments: number;
  Rate:number;
  Modules: Modules[];
}

export interface Modules{

};

