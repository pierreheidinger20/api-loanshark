import { IsNumber, IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { LoanStatus } from '../loan.entity';

class OrderDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateLoanDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  interestRate: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  borrowerName: string;

  @IsString()
  lenderName: string;

  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addresses?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  @IsOptional()
  orders?: OrderDto[];
}