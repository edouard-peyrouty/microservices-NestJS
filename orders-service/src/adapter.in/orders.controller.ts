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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les commandes' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll(): OrderResponseDto[] {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  findById(@Param('id') id: string): OrderResponseDto {
    return this.ordersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une commande' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  create(@Body() dto: CreateOrderDto): OrderResponseDto {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Commande non payée, ne peut pas être expédiée' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): OrderResponseDto {
    return this.ordersService.updateStatus(id, dto);
  }
}