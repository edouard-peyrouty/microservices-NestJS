import { OrderStatus } from './order-status.enum';

export class Order {
  id: string;
  userId: string;
  products: string[];
  status: OrderStatus;

  constructor(id: string, userId: string, products: string[]) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    this.status = OrderStatus.CREATED;
  }
}