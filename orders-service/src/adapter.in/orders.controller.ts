import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { OrdersService } from '../application/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): OrderResponseDto[] {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): OrderResponseDto {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateOrderDto): OrderResponseDto {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): OrderResponseDto {
    return this.ordersService.updateStatus(id, dto);
  }
}