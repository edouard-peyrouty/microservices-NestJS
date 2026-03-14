import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../domain/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}