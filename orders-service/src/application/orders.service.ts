import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '../infrastructure/orders.repository';
import { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';
import { CreateOrderDto } from '../adapter.in/dto/create-order.dto';
import { UpdateOrderStatusDto } from '../adapter.in/dto/update-order-status.dto';
import { CannotShipUnpaidOrderException } from '../domain/order.exceptions';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  findAll(): Order[] {
    return this.ordersRepository.findAll();
  }

  findById(id: string): Order {
    const order = this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);
    return order;
  }

  create(dto: CreateOrderDto): Order {
    return this.ordersRepository.create(dto.userId, dto.products);
  }

  updateStatus(id: string, dto: UpdateOrderStatusDto): Order {
    const order = this.findById(id);

    // Règle métier : ne peut pas être SHIPPED si pas PAID
    if (dto.status === OrderStatus.SHIPPED && order.status !== OrderStatus.PAID) {
      throw new CannotShipUnpaidOrderException();
    }

    const updated = this.ordersRepository.updateStatus(id, dto.status);
    if (!updated) throw new NotFoundException(`Commande ${id} introuvable`);
    return updated;
  }
}