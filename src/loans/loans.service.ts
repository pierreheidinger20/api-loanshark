import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan, LoanStatus, Order, User } from './loan.entity';
import { CreateLoanDto, UpdateLoanDto } from './dto/loan.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoanOutDto } from './dto/loanOut.dto';

@Injectable()
export class LoansService {
  constructor(@InjectRepository(Loan) private readonly loanRepository: Repository<Loan>) {}

  async create(user: User, loanData: CreateLoanDto): Promise<Loan> {
    const loan = this.loanRepository.create({
      ...loanData,
      startDate: new Date(loanData.startDate),
      endDate: loanData.endDate ? new Date(loanData.endDate) : null,
      user,
      orders: (loanData.orders || []).map((order) => ({
        ...order,
        date: new Date(order.date),
      })),
    });
    return this.normalizeLoan(await this.loanRepository.save(loan));
  }

  async findAllByUser(user: User, username: string) {
    if (user.username !== username) {
      throw new ForbiddenException('You can only access your own loans');
    }
    const loans = await this.loanRepository
      .createQueryBuilder('loan')
      // .where('loan.user = :user', { user: JSON.stringify(user) })
      .andWhere("loan.user ->> 'username' = :username", { username })
      .andWhere('loan.deleted = false')
      .orderBy('loan.createdAt', 'DESC')
      .getMany();
    loans.forEach((loan) => {
      loan.orders = this.sortOrders(loan.orders, 'DESC');
    });
    return this.mapLoanEntityToDto(loans);
  }

  async createUserOrders(username: string): Promise<Record<string, any>> {
    const loans = await this.loanRepository
      .createQueryBuilder('loan')
      .where("loan.user ->> 'username' = :username", { username })
      .andWhere('loan.deleted = false')
      .andWhere('loan.status = :status', { status: LoanStatus.ACTIVE })
      .orderBy('loan.createdAt', 'DESC')
      .getMany();

    for (const loan of loans) {
      const orders = this.sortOrders(loan.orders || [], 'ASC');
      let startDate = new Date(loan.startDate);
      if (orders.length > 0) startDate = new Date(orders[orders.length - 1].date);
      const dateNow = new Date();
      dateNow.setDate(startDate.getDate());
      while (dateNow > startDate) {
        startDate.setMonth(startDate.getMonth() + 1);
        loan.orders.push({
          orderId: `${loan.id}-${startDate.getFullYear()}-${startDate.getMonth() + 1}`,
          amount: Number(((Number(loan.amount) * Number(loan.interestRate)) / 100).toFixed(2)),
          date: new Date(startDate),
          status: 'pending',
          createdAt: new Date(),
        });
      }
    }
    await this.loanRepository.save(loans);
    loans.forEach((loan) => {
      loan.orders = this.sortOrders(loan.orders || [], 'DESC');
    });
    return this.mapLoanEntityToDto(loans);
  }

  private mapLoanEntityToDto(loans: Loan[]) {
    loans.forEach((loan) => this.normalizeLoan(loan));
    return instanceToPlain(plainToInstance(LoanOutDto, loans, { excludeExtraneousValues: true }));
  }

  async getIndicatorsByUser(username: string) {
    const loans = await this.loanRepository
      .createQueryBuilder('loan')
      .where("loan.user ->> 'username' = :username", { username })
      .andWhere('loan.deleted = false')
      .andWhere('loan.status = :status', { status: LoanStatus.ACTIVE })
      .orderBy('loan.createdAt', 'DESC')
      .getMany();
    return {
      totalActiveLoans: loans.length,
      totalActiveAmount: Number(loans.reduce((sum, loan) => sum + Number(loan.amount), 0).toFixed(2)),
      totalActiveMonthlyInterest: Number(
        loans.reduce((sum, loan) => sum + (Number(loan.amount) * Number(loan.interestRate)) / 100, 0).toFixed(2),
      ),
      totalAmountOrdersPaids: Number(
        loans
          .flatMap((loan) => loan.orders || [])
          .filter((order) => order.status === 'paid')
          .reduce((sum, order) => sum + Number(order.amount), 0)
          .toFixed(2),
      ),
    };
  }

  async updateOrderStatus(username: string, orderId: string, status: string) {
    const loans = await this.loanRepository
      .createQueryBuilder('loan')
      .where("loan.orders @> :order", { order: JSON.stringify([{ orderId }]) })
      .getMany();
    const loan = loans.find((item) => (item.orders || []).some((order) => order.orderId === orderId));
    if (!loan) throw new NotFoundException('Loan or order not found');
    const order = loan.orders.find((item) => item.orderId === orderId);
    order.status = status;
    await this.loanRepository.save(loan);
    return this.normalizeLoan(loan).orders.find((item) => item.orderId === orderId);
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const loan = await this.loanRepository.findOneBy({ id });
    if (!loan) throw new NotFoundException('Loan not found');
    if (updateLoanDto.status) loan.status = updateLoanDto.status;
    if (updateLoanDto.deleted !== undefined) loan.deleted = updateLoanDto.deleted;
    return this.normalizeLoan(await this.loanRepository.save(loan));
  }

  async delete(id: string) {
    const loan = await this.loanRepository.findOneBy({ id });
    if (!loan) throw new NotFoundException('Loan not found');
    loan.deleted = true;
    loan.status = LoanStatus.CANCELLED;
    return this.normalizeLoan(await this.loanRepository.save(loan));
  }

  private sortOrders(orders: Order[], direction: 'ASC' | 'DESC') {
    return [...(orders || [])].sort((a, b) =>
      direction === 'ASC'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  private normalizeLoan(loan: Loan): Loan {
    loan.orders = (loan.orders || []).map((order) => ({
      ...order,
      date: order.date ? new Date(order.date) : order.date,
      createdAt: order.createdAt ? new Date(order.createdAt) : order.createdAt,
    }));
    return loan;
  }
}
