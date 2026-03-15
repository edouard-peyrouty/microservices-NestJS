import axios from 'axios';

const GATEWAY_URL = 'http://localhost:3002';

let createdUserId: string;
let createdOrderId: string;
let jwtToken: string;

describe('API Gateway — Tests d\'intégration complets', () => {

  // ─── AUTH ────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('doit retourner un token JWT avec les bons identifiants', async () => {
      const response = await axios.post(`${GATEWAY_URL}/auth/login`, {
        username: 'admin',
        password: 'password123'
      });
      expect(response.status).toBe(201);
      expect(response.data.access_token).toBeDefined();
      jwtToken = response.data.access_token; // on garde le token pour les tests suivants
    });

    it('doit refuser de mauvais identifiants (401)', async () => {
      try {
        await axios.post(`${GATEWAY_URL}/auth/login`, {
          username: 'admin',
          password: 'mauvais'
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  // ─── AUTHENTIFICATION JWT ────────────────────────────

  describe('Authentification JWT', () => {
    it('doit refuser l\'accès sans token sur /users (401)', async () => {
      try {
        await axios.get(`${GATEWAY_URL}/users`);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('doit refuser l\'accès sans token sur /orders (401)', async () => {
      try {
        await axios.get(`${GATEWAY_URL}/orders`);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('doit refuser un token invalide (401)', async () => {
      try {
        await axios.get(`${GATEWAY_URL}/users`, {
          headers: { Authorization: 'Bearer tokeninvalide' }
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  // ─── USERS ───────────────────────────────────────────

  describe('POST /users', () => {
    it('doit créer un utilisateur via la gateway', async () => {
      const response = await axios.post(`${GATEWAY_URL}/users`, {
        nom: 'Edouard', email: 'edouard@test.com', role: 'admin'
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.nom).toBe('Edouard');
      createdUserId = response.data.id;
    });

    it('doit refuser un email invalide (400)', async () => {
      try {
        await axios.post(`${GATEWAY_URL}/users`, {
          nom: 'Edouard', email: 'pasunmail', role: 'admin'
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /users', () => {
    it('doit retourner la liste des utilisateurs', async () => {
      const response = await axios.get(`${GATEWAY_URL}/users`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('doit retourner un utilisateur par ID', async () => {
      const response = await axios.get(`${GATEWAY_URL}/users/${createdUserId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdUserId);
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      try {
        await axios.get(`${GATEWAY_URL}/users/uuid-inexistant`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /users/:id', () => {
    it('doit mettre à jour un utilisateur', async () => {
      const response = await axios.put(`${GATEWAY_URL}/users/${createdUserId}`, {
        nom: 'Edouard Modifié'
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.nom).toBe('Edouard Modifié');
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      try {
        await axios.put(`${GATEWAY_URL}/users/uuid-inexistant`, {
          nom: 'Test'
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('DELETE /users/:id', () => {
    it('doit supprimer un utilisateur', async () => {
      const response = await axios.delete(`${GATEWAY_URL}/users/${createdUserId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(204);
    });

    it('doit retourner 404 si l\'utilisateur n\'existe pas', async () => {
      try {
        await axios.delete(`${GATEWAY_URL}/users/uuid-inexistant`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  // ─── ORDERS ──────────────────────────────────────────

  describe('POST /orders', () => {
    it('doit créer une commande via la gateway', async () => {
      const response = await axios.post(`${GATEWAY_URL}/orders`, {
        userId: 'uuid-user-1', products: ['produit1', 'produit2']
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.status).toBe('CREATED');
      createdOrderId = response.data.id;
    });

    it('doit refuser une création sans userId (400)', async () => {
      try {
        await axios.post(`${GATEWAY_URL}/orders`, {
          products: ['produit1']
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('GET /orders', () => {
    it('doit retourner la liste des commandes', async () => {
      const response = await axios.get(`${GATEWAY_URL}/orders`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /orders/:id', () => {
    it('doit retourner une commande par ID', async () => {
      const response = await axios.get(`${GATEWAY_URL}/orders/${createdOrderId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdOrderId);
    });

    it('doit retourner 404 si la commande n\'existe pas', async () => {
      try {
        await axios.get(`${GATEWAY_URL}/orders/uuid-inexistant`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PATCH /orders/:id/status — règle métier', () => {
    it('doit passer une commande de CREATED à PAID', async () => {
      const response = await axios.patch(`${GATEWAY_URL}/orders/${createdOrderId}/status`, {
        status: 'PAID'
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('PAID');
    });

    it('doit bloquer le passage CREATED → SHIPPED (400)', async () => {
      // Crée une nouvelle commande en CREATED
      const newOrder = await axios.post(`${GATEWAY_URL}/orders`, {
        userId: 'uuid-user-2', products: ['produit3']
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });

      try {
        await axios.patch(`${GATEWAY_URL}/orders/${newOrder.data.id}/status`, {
          status: 'SHIPPED'
        }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

});