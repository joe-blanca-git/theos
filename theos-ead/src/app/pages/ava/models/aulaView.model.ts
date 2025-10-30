export class aulaViewModel {
    AulaId!: number;
    CursoId!: string;
    Titulo!: string;
    DescSm!: string;
    ImgHeader!: string;
    Aulas!:aulas;

    public mapFromApi(item: any): aulaViewModel {
        this.AulaId = item.AulaId;
        this.CursoId = item.CursoId;
        this.Titulo = item.Titulo;
        this.DescSm = item.DescSm;
        this.ImgHeader = item.ImgHeader;
        this.Aulas = item.Aulas;
        return this;
    }
}

export class aulas{
    Id!: number
    Titulo!: string;
    Duracao!: number;
    DescSm!: string;
    StatusView!: string;
    UrlVideo!:string;
}
