import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from '../infrastructure/orders.repository';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../domain/order-status.enum';
import { CannotShipUnpaidOrderException } from '../domain/order.exceptions';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: OrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<OrdersRepository>(OrdersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('doit créer une commande avec le statut CREATED', () => {
      const dto = { userId: 'uuid-1', products: ['produit1', 'produit2'] };
      const fakeOrder = { id: 'uuid-order-1', ...dto, status: OrderStatus.CREATED };

      jest.spyOn(repository, 'create').mockReturnValue(fakeOrder);

      const result = service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto.userId, dto.products);
      expect(result.status).toBe(OrderStatus.CREATED);
    });
  });

  describe('findAll', () => {
    it('doit retourner la liste de toutes les commandes', () => {
      const fakeOrders = [
        { id: 'uuid-1', userId: 'u1', products: ['p1'], status: OrderStatus.CREATED },
        { id: 'uuid-2', userId: 'u2', products: ['p2'], status: OrderStatus.PAID },
      ];

      jest.spyOn(repository, 'findAll').mockReturnValue(fakeOrders);

      const result = service.findAll();

      expect(result).toEqual(fakeOrders);
      expect(result).toHaveLength(2);
    });

    it('doit retourner un tableau vide si aucune commande', () => {
      jest.spyOn(repository, 'findAll').mockReturnValue([]);

      const result = service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('doit retourner une commande existante', () => {
      const fakeOrder = { id: 'uuid-1', userId: 'u1', products: ['p1'], status: OrderStatus.CREATED };

      jest.spyOn(repository, 'findById').mockReturnValue(fakeOrder);

      const result = service.findById('uuid-1');

      expect(result).toEqual(fakeOrder);
    });

    it('doit lancer une NotFoundException si la commande n\'existe pas', () => {
      jest.spyOn(repository, 'findById').mockReturnValue(undefined);

      expect(() => service.findById('uuid-inexistant')).toThrow(NotFoundException);
    });
  });

  describe('updateStatus — règle métier', () => {
    it('doit autoriser le passage CREATED → PAID', () => {
      const fakeOrder = { id: 'uuid-1', userId: 'u1', products: [], status: OrderStatus.CREATED };
      const updated = { ...fakeOrder, status: OrderStatus.PAID };

      jest.spyOn(repository, 'findById').mockReturnValue(fakeOrder);
      jest.spyOn(repository, 'updateStatus').mockReturnValue(updated);

      const result = service.updateStatus('uuid-1', { status: OrderStatus.PAID });

      expect(result.status).toBe(OrderStatus.PAID);
    });

    it('doit autoriser le passage PAID → SHIPPED', () => {
      const fakeOrder = { id: 'uuid-1', userId: 'u1', products: [], status: OrderStatus.PAID };
      const updated = { ...fakeOrder, status: OrderStatus.SHIPPED };

      jest.spyOn(repository, 'findById').mockReturnValue(fakeOrder);
      jest.spyOn(repository, 'updateStatus').mockReturnValue(updated);

      const result = service.updateStatus('uuid-1', { status: OrderStatus.SHIPPED });

      expect(result.status).toBe(OrderStatus.SHIPPED);
    });

    it('doit bloquer le passage CREATED → SHIPPED', () => {
      const fakeOrder = { id: 'uuid-1', userId: 'u1', products: [], status: OrderStatus.CREATED };

      jest.spyOn(repository, 'findById').mockReturnValue(fakeOrder);

      expect(() =>
        service.updateStatus('uuid-1', { status: OrderStatus.SHIPPED })
      ).toThrow(CannotShipUnpaidOrderException);
    });

    it('doit lancer une NotFoundException si la commande n\'existe pas', () => {
      jest.spyOn(repository, 'findById').mockReturnValue(undefined);

      expect(() =>
        service.updateStatus('uuid-inexistant', { status: OrderStatus.PAID })
      ).toThrow(NotFoundException);
    });
  });
});