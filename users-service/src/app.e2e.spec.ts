import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';

describe('Users Service — Tests d\'intégration', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdUserId: string;

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

  describe('POST /auth/login', () => {
    it('doit retourner un token JWT avec les bons identifiants', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'password123' })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      jwtToken = response.body.access_token; // on garde le token pour les tests suivants
    });

    it('doit retourner 401 avec de mauvais identifiants', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'mauvais' })
        .expect(401);
    });
  });

  // ─── USERS SANS TOKEN ────────────────────────────────

  describe('Authentification JWT', () => {
    it('doit refuser l\'accès sans token (401)', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('doit refuser l\'accès avec un token invalide (401)', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer tokeninvalide')
        .expect(401);
    });
  });

  // ─── USERS AVEC TOKEN ────────────────────────────────

  describe('POST /users', () => {
    it('doit créer un utilisateur', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nom: 'Edouard', email: 'edouard@test.com', role: 'admin' })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.nom).toBe('Edouard');
      createdUserId = response.body.id; // on garde l'id pour les tests suivants
    });

    it('doit refuser une création avec un email invalide (400)', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nom: 'Edouard', email: 'pasunmail', role: 'admin' })
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('doit retourner la liste des utilisateurs', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('doit retourner un utilisateur par ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      await request(app.getHttpServer())
        .get('/users/uuid-inexistant')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('doit mettre à jour un utilisateur', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nom: 'Edouard Modifié' })
        .expect(200);

      expect(response.body.nom).toBe('Edouard Modifié');
      expect(response.body.id).toBe(createdUserId);
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      await request(app.getHttpServer())
        .put('/users/uuid-inexistant')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nom: 'Test' })
        .expect(404);
    });

    it('doit refuser un email invalide (400)', async () => {
      await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ email: 'pasunmail' })
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('doit supprimer un utilisateur', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(204);
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      await request(app.getHttpServer())
        .delete('/users/uuid-inexistant')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});