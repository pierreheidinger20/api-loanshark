import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument, LoanStatus, Order, User } from './loan.entity';
import { CreateLoanDto, UpdateLoanDto } from './dto/loan.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoanOutDto } from './dto/loanOut.dto';
import { Types } from 'mongoose';


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
                .find({ user, 'user.username': username ,'deleted': false })
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
                .find({ 'user.username': username , 'deleted': false , status: LoanStatus.ACTIVE})
                .sort({ createdAt: -1 });
        console.log(userLoans);
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
        userLoans.forEach(loan => {
            loan.orders = loan.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
        return this.mapLoanEntityToDto(userLoans);
    }

    private mapLoanEntityToDto(loans: Loan[]) {

        let loansDto = plainToInstance(LoanOutDto, loans, {
            excludeExtraneousValues: true,
        });
        return instanceToPlain(loansDto);
    }

    async getIndicatorsByUser(username: string) {
        let loans
            = await this.loanModel
                .find({ 'user.username': username })
                .sort({ createdAt: -1 });
        loans = loans.filter(loan => loan.status === LoanStatus.ACTIVE);
        let totalActiveLoans = loans.length;
        let totalActiveAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
        let totalActiveMonthlyInterest = loans.reduce((sum, loan) => sum + (loan.amount * loan.interestRate) / 100, 0);
        let totalAmountOrdersPaids = loans.map(loan => loan.orders.filter(order => order.status === 'paid'))
            .flat()
            .reduce((sum, order) => sum + order.amount, 0);
        return {
            totalActiveLoans: totalActiveLoans,
            totalActiveAmount: Number(totalActiveAmount.toFixed(2)),
            totalActiveMonthlyInterest: Number(totalActiveMonthlyInterest.toFixed(2)),
            totalAmountOrdersPaids: Number(totalAmountOrdersPaids.toFixed(2)),
        };
    }

    async updateOrderStatus(username: string, orderId: string, status: string) {
        const loan = await this.loanModel.findOne({ 'orders.orderId': orderId });
        if (!loan) {
            throw new Error('Loan not found');
        }
        const order = loan.orders.find(order => order.orderId === orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        await loan.save();
        return order;
    }

    async update(id: any, updateLoanDto: UpdateLoanDto) {
      const loan = await this.loanModel.findOne({ '_id':  Types.ObjectId.createFromHexString(id) });
      console.log(loan);
      if (!loan) {
        throw new Error('Loan not found');
      }
      loan.status = updateLoanDto.status;
      loan.save();
      return loan;
    }

    async delete(id: any) {
      const loan = await this.loanModel.findOne({ '_id': Types.ObjectId.createFromHexString(id) });
      loan.deleted = true;
      loan.status = LoanStatus.CANCELLED;
      loan.save();
      return loan;
    }
}