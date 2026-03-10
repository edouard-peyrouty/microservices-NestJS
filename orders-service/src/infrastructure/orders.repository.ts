import { Injectable } from '@nestjs/common';
import { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersRepository {
  private orders: Order[] = [];

  findAll(): Order[] {
    return this.orders;
  }

  findById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  create(userId: string, products: string[]): Order {
    const order = new Order(uuidv4(), userId, products);
    this.orders.push(order);
    return order;
  }

  updateStatus(id: string, status: OrderStatus): Order | undefined {
    const order = this.findById(id);
    if (!order) return undefined;
    order.status = status;
    return order;
  }
}