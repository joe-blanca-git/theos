export class cursosModel {
    Id!: number;
    Titulo!: string;
    Descricao!: string;
    DescricaoResumida!: string;
    Origem!: string;
    CategoriaId!: number;
    Duracao!: number;
    Categoria!: string;
    DataInc!: string;
    UrlImgHeader!: string;
    UrlHeaderView!: string;
    Status!: string;
    Valor!: number;
    Modulos!: modulos[]; 
    public mapFromApi(item: any): cursosModel {
        this.Id = item.Id;
        this.Titulo = item.Titulo;
        this.Descricao = item.Descricao;
        this.DescricaoResumida = item.DescricaoResumida;
        this.Origem = item.Origem;
        this.CategoriaId = item.CategoriaId;
        this.Duracao = item.Duracao;
        this.Categoria = item.Categoria;
        this.DataInc = item.DataInc;
        this.UrlImgHeader = item.UrlImgHeader;
        this.UrlHeaderView = item.UrlHeaderView;
        this.Status = item.Status;
        this.Valor = item.Valor;
        this.Modulos = item.Modulos ? item.Modulos.map((aula: any) => new modulos().mapFromApi(aula)) : [];

        return this;
    }
}

export class modulos {
    ModuloId!: number;
    Titulo!: string;
    Descricao!: string;
    Duracao!: number;
    Status!: string;
    UrlImg!: string;
    NrAula!: string;
    Aulas!: aulas[];

    public mapFromApi(item: any): modulos {
        this.ModuloId = item.ModuloId;
        this.Titulo = item.Titulo;
        this.Descricao = item.Descricao;
        this.Status = item.Status;
        this.UrlImg = item.UrlImg;
        this.NrAula = item.NrAula;
        this.Aulas = item.Aulas ? item.Aulas.map((video: any) => new aulas().mapFromApi(video)) : []; 

        return this;
    }
}

export class aulas {
    AulaId!: number;
    ModuloId!: number;
    Modulo!: string;
    AulaTitulo!: string;
    Duracao!: number;
    Descricao!: string;
    StatusView!: string;
    UrlVideo!: string;
    NrVideo!: string;
    Ordem!: number;

    public mapFromApi(item: any): aulas {
        this.AulaId = item.AulaId;
        this.ModuloId = item.ModuloId;
        this.Modulo = item.Modulo;
        this.AulaTitulo = item.AulaTitulo;
        this.Duracao = item.Duracao;
        this.Descricao = item.Descricao;
        this.StatusView = item.StatusView;
        this.UrlVideo = item.UrlVideo;
        this.NrVideo = item.NrVideo;
        this.Ordem = item.Ordem;

        return this;
    }
}

export class cursoModel {
    Curso: any;
}

export class Curso {
    titulo!: string;
    origem!: string;
    descricao!: string;
    descricaoResumida!: string;
    urlCartaz!: string;
    urlCabecalho!:string;
    urlVisao!: string;
    categoria!: number;
    autor!: number;
    valor!: number;
}
