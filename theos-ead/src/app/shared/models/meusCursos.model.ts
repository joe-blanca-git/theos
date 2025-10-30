export class meusCursosModel {
    CursoId!: number;
    Titulo!: string;
    Origem!: string;
    Duracao!: number;
    Categoria!: string;
    CategoriaId!: number;
    CategoriaIcone!:string;
    CategoriaCor!:string;
    DuracaoTotal!: number;
    DuracaoConcluida!: number;
    PercentualConclusao!: number;
    Aulas!:aulas;

    public mapFromApi(item: any): meusCursosModel {
        this.CursoId = item.CursoId;
        this.Titulo = item.Titulo;
        this.Origem = item.Origem;
        this.CategoriaId = item.CategoriaId;
        this.Duracao = item.Duracao;
        this.Categoria = item.Categoria;
        this.CategoriaIcone = item.CategoriaIcone;
        this.CategoriaCor = item.CategoriaCor;
        this.DuracaoTotal = item.DuracaoTotal;
        this.DuracaoConcluida = item.DuracaoConcluida;
        this.PercentualConclusao = item.PercentualConclusao;
        this.Aulas = item.Aulas;
        return this;
    }
}

export class aulas{
    Id!: number
    Titulo!: string;
    Duracao!: number;
    Status!: string;
    StatusConclusao!: string;
}