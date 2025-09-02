import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type LoanDocument = Loan & Document;

export enum LoanStatus {
  ACTIVE = 'active',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum PaymentFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

// Define el esquema embebido para User
@Schema({ _id: false })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  full_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


// Define el esquema embebido para Order
@Schema({ _id: false })
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

@Schema({
  versionKey: false
})
export class Loan {

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  interestRate: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true })
  borrowerName: string;

  @Prop({ required: true })
  lenderName: string;

  @Prop({ enum: LoanStatus, default: LoanStatus.ACTIVE })
  status: LoanStatus;

  @Prop({ type: [String], default: [] })
  addresses: string[];

  @Prop({ enum: PaymentFrequency, default: PaymentFrequency.MONTHLY })
  paymentFrequency: PaymentFrequency;

  @Prop({ type: [OrderSchema], default: [] })
  orders: Order[];

  @Prop({ type: UserSchema, required: true })
  user: User;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);