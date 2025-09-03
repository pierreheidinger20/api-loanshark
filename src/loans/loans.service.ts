import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument, Order, User } from './loan.entity';
import { CreateLoanDto } from './dto/loan.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoanOutDto } from './dto/loanOut.dto';

@Injectable()
export class LoansService {
    constructor(
        @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    ) { }

    async create(user: User, loanData: CreateLoanDto): Promise<Loan> {
        const createdLoan = new this.loanModel({ ...loanData, user });
        return createdLoan.save();
    }

    async findAllByUser(user: User, username: string) {
        if (user.username !== username) {
            throw new ForbiddenException("You can only access your own loans");
        }
        let loans
            = await this.loanModel
                .find({ user, 'user.username': username })
                .sort({ createdAt: -1 })
                .populate('user', 'username')
        loans.forEach(loan => {
            loan.orders = loan.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
        return this.mapLoanEntityToDto(loans);
    }

    async createUserOrders(username: string): Promise<Record<string, any>> {
        let userLoans
            = await this.loanModel
                .find({ 'user.username': username })
                .sort({ createdAt: -1 });

        for (let loan of userLoans) {
            var orders = loan.orders;
            var countOrders = orders.length;
            var startDate = new Date(loan.startDate);
            var dateNow = new Date();
            if (countOrders > 0) {
                orders = orders.sort((a, b) => a.date.getTime() - b.date.getTime());
                let lastOrder = orders[orders.length - 1];
                startDate = new Date(lastOrder.date);
            }
            dateNow.setDate(startDate.getDate());
            while (dateNow > startDate) {
                startDate.setMonth(startDate.getMonth() + 1);
                let order = new Order();
                order.orderId = `${loan.id}-${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
                order.amount = Number(((loan.amount * loan.interestRate) / 100).toFixed(2));
                order.date = new Date(startDate);
                order.status = 'pending';
                order.createdAt = new Date();
                loan.orders.push(order);
            }
            loan.save();
        }
        console.log('userLoans', userLoans);
        userLoans.forEach(loan => {
            loan.orders = loan.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
        console.log('userLoans after', userLoans);
        return this.mapLoanEntityToDto(userLoans);
    }

    private mapLoanEntityToDto(loans: Loan[]){

        let loansDto = plainToInstance(LoanOutDto, loans, {
            excludeExtraneousValues: true,
        });
        return instanceToPlain(loansDto);
    }
}