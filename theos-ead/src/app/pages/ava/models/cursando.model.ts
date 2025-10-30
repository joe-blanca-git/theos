export class cursandoModel {
    CursoId!: number;
    Titulo!: string;
    Origem!: string;
    TotalHorasVisto!: number;
    Progresso!: number;
   
    Aulas!:aulas;

    public mapFromApi(item: any): cursandoModel {
        this.CursoId = item.CursoId;
        this.Titulo = item.Titulo;
        this.Origem = item.Origem;
        this.TotalHorasVisto = item.TotalHorasVisto;
        this.Progresso = item.Progresso;        
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