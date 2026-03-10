import { Module } from '@nestjs/common';
import { OrdersController } from '../adapter.in/orders.controller';
import { OrdersService } from '../application/orders.service';
import { OrdersRepository } from '../infrastructure/orders.repository';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
  ],
})
export class OrdersModule {}