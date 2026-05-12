export class PaymentModel {
    PaymentId!: number;
    PaymentIdExternal!: string;
    UserId!:  number;
    OrderId!:  number;
    Status!:  string;
    DateInc!:  string;
}

export class PaymentsModel {
    PaymentId!: number;
    Description!: string;
    Method!: string;
    Status!:  string;
    Emition!:  string;
}