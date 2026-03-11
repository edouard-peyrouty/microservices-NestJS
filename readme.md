# TP3 — Microservices NestJS

## Installation et lancement en local

### Prérequis
Installer Node.js v24.14.0 (npm est inclus automatiquement) : https://nodejs.org

Vérifier l'installation :
```bash
node -v
npm -v
```

### Installer NestJS CLI
```bash
npm i -g @nestjs/cli
```

### Installer les dépendances de chaque service
```bash
cd users-service
npm install

cd ../orders-service
npm install

cd ../api-gateway
npm install axios
```

### Lancer les services
Ouvrir 3 terminaux séparés :

**Terminal 1 :**
```bash
cd users-service
npm run start:dev
```

**Terminal 2 :**
```bash
cd orders-service
npm run start:dev
```

**Terminal 3 :**
```bash
cd api-gateway
npm run start:dev
```

Les services seront disponibles sur :
- Users service : http://localhost:3000
- Orders service : http://localhost:3001
- API Gateway : http://localhost:3002

---

## Installation et lancement avec Docker