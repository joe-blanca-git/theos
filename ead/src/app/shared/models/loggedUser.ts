export class LoggedUsers {
  id!: number;
  username!: string;
  claims!: claims[];
  courses!: courses[];
}

export class claims {
  value!: string;
  type!: string;
  nome!: string;
}

export class courses {}
