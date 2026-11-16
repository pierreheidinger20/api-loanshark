import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { ConfigService } from '@nestjs/config';
import { LoansController } from './loans.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
  ],
  controllers: [LoansController],
  providers: [ConfigService, LoansService],
})
export class LoansModule {}
