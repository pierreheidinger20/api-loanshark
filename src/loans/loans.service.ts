import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument, User } from './loan.entity';
import { CreateLoanDto } from './dto/loan.dto';

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
        if(user.username !== username) {
            throw new ForbiddenException("You can only access your own loans");
        }
        return this.loanModel.find({ user, 'user.username': username });
    }
}