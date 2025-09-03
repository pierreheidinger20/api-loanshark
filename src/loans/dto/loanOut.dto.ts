
import { Exclude, Expose, Type } from 'class-transformer';

export class OrderOutDto {
    @Expose()
    orderId: string;

    @Expose()
    amount: number;

    @Expose()
    date: Date;

    @Expose()
    status: string;
}

export class LoanOutDto {
    @Expose()
    id: number;

    @Expose()
    amount: number;

    @Expose()
    interestRate: number;

    @Expose()
    startDate: Date;

    @Expose()
    endDate: Date;

    @Expose()
    borrowerName: string;

    @Expose()
    lenderName: string;

    @Expose()
    status: string;

    @Expose()
    createdAt?: Date;

    @Expose()
    paymentFrequency: string;

    @Expose({ toPlainOnly: true })
    get amountInterest(): number {
        return Number(((this.interestRate * this.amount) / 100).toFixed(2));
    }

    @Expose()
    @Type(() => OrderOutDto)
    orders: OrderOutDto[];
}