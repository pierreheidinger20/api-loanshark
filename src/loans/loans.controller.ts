import { Body, Controller, Get, Param, Patch, Post, Put, Request } from '@nestjs/common';
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

  @Get(':username/indicators')
  async getIndicatorsByUser(@Request() request,@Param('username') username: string) {
    const user = request['user'];
    return this.loansService.getIndicatorsByUser(username);
  }

  @Put(':username/order/:orderId/status/:status')
  async updateOrderStatus(@Request() request  ,@Param('username') username: string,@Param('orderId') orderId: string,@Param('status') status: string) {
    const user = request['user'];
    return this.loansService.updateOrderStatus(username,orderId,status);
  }
}