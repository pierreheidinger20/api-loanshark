import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './loan.entity';
import { ConfigService } from '@nestjs/config';
import { LoansController } from './loans.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Loan.name, schema: LoanSchema }]),
  ],
  controllers: [LoansController],
  providers: [ConfigService, LoansService],
})
export class LoansModule {}
