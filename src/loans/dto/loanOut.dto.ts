
import { Exclude, Expose } from 'class-transformer';

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
}