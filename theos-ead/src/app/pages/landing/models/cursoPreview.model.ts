export class cursoPreviewModel {
    IdCurso!: number;
    Titulo!: string;
    Descricao!: string;
    DescricaoSm!: string;
    TituloAula!: string;
    IdAula!: string;
    UrlImgHeader!: string;
    UrlImg!: number;
    UrlHeaderView!: string;
    Status!: string;
    Aulas!: aulas;

    public mapFromApi(item: any): cursoPreviewModel {
        this.IdCurso = item.IdCurso;
        this.Titulo = item.Titulo;
        this.Descricao = item.Descricao;
        this.DescricaoSm = item.DescricaoSm;
        this.TituloAula = item.TituloAula;
        this.IdAula = item.IdAula;
        this.UrlImgHeader = item.UrlImgHeader;
        this.UrlImg = item.UrlImg;
        this.UrlHeaderView = item.UrlHeaderView;
        this.Status = item.Status;
        this.Aulas = item.Aulas;
        
        return this;
    }
}

export class aulas{
    Id!: number
    Titulo!: string;
    Duracao!: number;
    Status!: string;
    Videos!: videos;
}

export class videos{
    VideoId!: number;
}
