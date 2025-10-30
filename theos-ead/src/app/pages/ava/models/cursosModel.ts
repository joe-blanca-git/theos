export class cursosModel {
    CursoId!: any;
    Titulo!: string;
    Origem!: string;
    CategoriaId!: number;
    Duracao!: string;
    Categoria!: string;
    CategoriaIcone!: string;
    CategoriaCor!: string;
    DataInc!: Date;
    UrlPoster!: string;
    UrlHeader!: string;
    Avaliacao!: number;
    Valor!: number;
    Status!: string;
    Autor!: string;
    Compra?: boolean;
    TotalHorasVisto!: number;
    ultimaModuloId!: number;
    ultimaAulaId!: number;
    Progresso!: number;
    curso_comprado!: number;
    Descricao!: string;
    Aulas!: aulas[]; 
    public mapFromApi(item: any): cursosModel {
        this.CursoId = item.CursoId;
        this.Titulo = item.Titulo;
        this.Origem = item.Origem;
        this.CategoriaId = item.CategoriaId;
        this.Duracao = item.Duracao;
        this.Categoria = item.Categoria;
        this.CategoriaIcone = item.CategoriaIcone;
        this.CategoriaCor = item.CategoriaCor;
        this.DataInc = new Date(item.DataInc);
        this.UrlPoster = item.UrlPoster;
        this.UrlHeader = item.UrlHeader;
        this.Avaliacao = item.Avaliacao;
        this.Valor = item.Valor;
        this.Status = item.Status;
        this.Autor = item.Autor;
        this.Compra = item.Compra; 
        this.TotalHorasVisto = item.TotalHorasVisto;
        this.ultimaModuloId = item.ultimaModuloId;
        this.ultimaAulaId = item.ultimaAulaId;
        this.Progresso = item.Progresso;
        this.curso_comprado = item.curso_comprado;
        this.Descricao = item.Descricao;
        this.Aulas = item.Aulas ? item.Aulas.map((aula: any) => new aulas().mapFromApi(aula)) : [];

        return this;
    }
}

export class aulas {
    AulaId!: number;
    Titulo!: string;
    Duracao!: number;
    Status!: string;
    StatusConclusao!: string;
    UrlImg!: string;
    Videos!: videos[];

    public mapFromApi(item: any): aulas {
        this.AulaId = item.AulaId;
        this.Titulo = item.Titulo;
        this.Duracao = item.Duracao;
        this.Status = item.Status;
        this.StatusConclusao = item.StatusConclusao;
        this.UrlImg = item.UrlImg;
        this.Videos = item.Videos ? item.Videos.map((video: any) => new videos().mapFromApi(video)) : []; 

        return this;
    }
}

export class videos {
    VideoId!: number;
    TituloVideo!: string;
    Duracao!: number;
    Descricao!: string;
    StatusView!: string;
    UrlVideo!: string;
    Ordem!: number;

    public mapFromApi(item: any): videos {
        this.VideoId = item.VideoId;
        this.TituloVideo = item.TituloVideo;
        this.Duracao = item.Duracao;
        this.Descricao = item.Descricao;
        this.StatusView = item.StatusView;
        this.UrlVideo = item.UrlVideo;
        this.Ordem = item.Ordem;

        return this;
    }
}
