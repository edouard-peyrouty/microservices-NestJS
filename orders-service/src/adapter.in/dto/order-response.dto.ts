import { OrderStatus } from '../../domain/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 'order-12345' })
  id: string;

  @ApiProperty({ example: 'user-12345' })
  userId: string;

  @ApiProperty({ example: ['product-12345', 'product-67890'] })
  products: string[];

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
  status: OrderStatus;
}