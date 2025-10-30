export class TeachersModel {
  UserId!: number;
  PeopleId!: number;
  Name!: string;
}

export class CourseCategoryModel {
  CategoryId!: number;
  Name!: string;
  Description!: string;
  Icon!: string;
  Color!: string;
}

export class CourseModel {
  CodeCourse!: number;
  CodeCloud!: number;
  Title!: string;
  DescriptionShort!: string;
  DescriptionLarge!: string;
  Poster!: string;
  Cover!: string;
  CodeCategory!: number;
  NameCategory!: string;
  DateRegister!: string;
  SecondsDuration!: number;
  Status!: string;
  Price!: number;
  Modulos!: ModulesModel[];
}

export class ModulesModel {}
