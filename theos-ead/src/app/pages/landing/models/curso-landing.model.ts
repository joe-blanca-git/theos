export class cursosLandingModel {
    Id!: number;
    Titulo!: string;
    Origem!: string;
    Descricao!: string;
    DescricaoResumida!: string;
    UrlImg!: string;
    UrlImgHeader!: string;
    UrlHeaderView!: string;
    CategoriaId!: number;
    Categoria!: string;
    DataInc!: Date;
    Duracao!: number;
    Status!: string;
    Aulas!: aulas;

    public mapFromApi(item: any): cursosLandingModel {
        this.Id = item.Id;
        this.Titulo = item.Titulo;
        this.Origem = item.Origem;
        this.Descricao = item.Descricao;
        this.DescricaoResumida = item.DescricaoResumida;
        this.UrlImg = item.UrlImg;
        this.UrlImgHeader = item.UrlImgHeader;
        this.UrlHeaderView = item.UrlHeaderView;
        this.CategoriaId = item.CategoriaId;
        this.Categoria = item.Categoria;
        this.DataInc = new Date(item.DataInc);
        this.UrlImg = item.UrlImg;
        this.Duracao = item.Duracao;
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
}
