import { OrderStatus } from '../../domain/order-status.enum';

export class OrderResponseDto {
  id: string;
  userId: string;
  products: string[];
  status: OrderStatus;
}