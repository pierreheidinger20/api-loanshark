import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/loan.dto';

@Controller()
export class LoansController {
  constructor(private readonly loansService: LoansService) {}


  @Get(':username')
  async findAllByUser(@Request() request,@Param('username') username: string) {
    const user = request['user'];
    return this.loansService.findAllByUser(user, username);
  }

  @Post()
  async create(@Request() request,@Body() createLoanDto: CreateLoanDto) {
    const user = request['user'];
    return this.loansService.create(user,createLoanDto);
  }

  @Post(':username/orders')
  async createUserOrders(@Request() request,@Param('username') username: string) {
    const user = request['user'];
    return this.loansService.createUserOrders(username);
  }
}