import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';

describe('Orders Service — Tests d\'intégration', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── AUTH ────────────────────────────────────────────

  describe('Authentification JWT', () => {
    it('doit refuser l\'accès sans token (401)', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .expect(401);
    });

    it('doit refuser l\'accès avec un token invalide (401)', async () => {
      await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', 'Bearer tokeninvalide')
        .expect(401);
    });
  });

  // ─── SETUP TOKEN ─────────────────────────────────────

  beforeAll(async () => {
    // orders-service n'a pas de route login
    // on génère le token manuellement avec la même clé secrète
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'secret' });
    jwtToken = jwtService.sign({ username: 'admin', role: 'admin' });
  });

  // ─── ORDERS ──────────────────────────────────────────

  describe('POST /orders', () => {
    it('doit créer une commande', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ userId: 'uuid-user-1', products: ['produit1', 'produit2'] })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('CREATED');
      createdOrderId = response.body.id;
    });

    it('doit refuser une création sans userId (400)', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ products: ['produit1'] })
        .expect(400);
    });
  });

  describe('GET /orders', () => {
    it('doit retourner la liste des commandes', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /orders/:id', () => {
    it('doit retourner une commande par ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.id).toBe(createdOrderId);
    });

    it('doit retourner 404 si la commande n\'existe pas', async () => {
      await request(app.getHttpServer())
        .get('/orders/uuid-inexistant')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('PATCH /orders/:id/status — règle métier', () => {
    it('doit passer une commande de CREATED à PAID', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ status: 'PAID' })
        .expect(200);

      expect(response.body.status).toBe('PAID');
    });

    it('doit bloquer le passage CREATED → SHIPPED (400)', async () => {
      // Crée une nouvelle commande en CREATED
      const newOrder = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ userId: 'uuid-user-2', products: ['produit3'] })
        .expect(201);

      // Essaie de la passer directement en SHIPPED
      await request(app.getHttpServer())
        .patch(`/orders/${newOrder.body.id}/status`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ status: 'SHIPPED' })
        .expect(400);
    });
  });
}); 