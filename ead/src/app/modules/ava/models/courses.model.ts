export class LatestCoursesModel {
  Title!: string;
  DescriptionSmall!: string;
  Rate!: number;
  Year!: number;
  DurationSeconds!: number;
  Category!: string;
  CategoryId!: number;
  CourseId!: number;
  Poster!: string;
  CategoryCover!: string;
}

export class CourseDetailModel {
  Title!: string;
  DescriptionSmall!: string;
  DescriptionLarge!: string;
  AuthorName!: string;
  AuthorId!: number;
  AuthorAvatar!: string;
  Comments!: string;
  Rate!: number;
  Year!: number;
  DurationSeconds!: number;
  Category!: string;
  CategoryId!: number;
  CategoryCover!: string;
  CourseId!: number;
  Poster!: string;
  Cover!: string;
  Price!: string;
  PaymentStatus!: string;
  Method!: string;
  AllowedCourse!: boolean;
  Modules!: Modules[];
}

class Modules {
  Name!: string;
  Order!: number;
  ModuleId!: number;
  Description!: string;
  Status!: string;
  Cover!: string;
  Lessons!: Lessons[];
}

class Lessons {
  Name!: string;
  Order!: number;
  Status!: string;
  DateInc!: string;
  LessonId!: number;
  VideoUrl!: string;
  Description!: string;
  DurationSeconds!: number;
}
