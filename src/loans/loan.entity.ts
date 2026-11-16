import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { randomBytes } from 'crypto';

export enum LoanStatus {
  ACTIVE = 'active',
  COMPLETE = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class User {
  username: string;
  email: string;
  full_name: string;
}

export class Order {
  orderId: string;
  amount: number;
  date: Date;
  status: string;
  createdAt: Date;
}

@Entity('loans', { schema: 'public' })
export class Loan {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  id: string = randomBytes(12).toString('hex');

  @Column('double precision')
  amount: number;

  @Column('double precision')
  interestRate: number;

  @Column('timestamptz')
  startDate: Date;

  @Column('timestamptz', { nullable: true })
  endDate: Date;

  @Column()
  borrowerName: string;

  @Column()
  lenderName: string;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.ACTIVE })
  status: LoanStatus;

  @Column('text', { array: true, default: () => "'{}'" })
  addresses: string[];

  @Column({ type: 'enum', enum: PaymentFrequency, default: PaymentFrequency.MONTHLY })
  paymentFrequency: PaymentFrequency;

  @Column('jsonb', { default: () => "'[]'::jsonb" })
  orders: Order[];

  @Column('jsonb')
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: false })
  deleted: boolean;
}
