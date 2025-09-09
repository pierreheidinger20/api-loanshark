import { IsNumber, IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString, isBoolean } from 'class-validator';
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

class UserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  full_name: string;
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

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}

export class UpdateLoanDto {

  @IsEnum(LoanStatus)
  status?: LoanStatus;

  @IsOptional()
  deleted?: boolean;
}