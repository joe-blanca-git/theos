export class totaisUserModel {
    Cursando!: number;
    ModulosVistos!: number;
    Concluido!: number;
    HorasTotais!: number;
    HorasCursadas!: number;


    public mapFromApi(item: any): totaisUserModel {
        this.Cursando = item.Cursando;
        this.Concluido = item.Concluido;
        this.ModulosVistos = item.ModulosVistos;
        this.HorasTotais = item.horasTotais;
        this.HorasCursadas = item.horasCursadas;

        return this;
    }
}
