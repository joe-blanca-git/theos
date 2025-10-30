export class lastVideoModel {
    UserId!: number;
    CursoId!: number;
    ModuloId!: number;
    VideoId!: number;
    DataInc!: string;

    public mapFromApi(item: any): lastVideoModel {
        this.UserId = item.UserId;
        this.CursoId = item.CursoId;
        this.ModuloId = item.ModuloId;
        this.VideoId = item.VideoId;
        this.DataInc = item.DataInc;

        return this;
    }
}