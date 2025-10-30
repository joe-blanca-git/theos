export class ModulosModel {
    ModuloId!: number;
    CursoId!:number;
    Nome!: string;
    Desc!: string;
    Professor!: string;
    ProfessorId!: number;
    Status!: string;
    StatusConclusao!: string;
    UrlImg!: string;

    public mapFromApi(item: any): ModulosModel {
            this.ModuloId = item.ModuloId;
            this.CursoId = item.CursoId;
            this.Nome = item.Nome;
            this.Desc = item.Desc;
            this.Professor = item.Professor;
            this.ProfessorId = item.ProfessorId;
            this.Status = item.Status;
            this.StatusConclusao = item.StatusConclusao;
            this.UrlImg = item.UrlImg;
    
            return this;
        }
}
