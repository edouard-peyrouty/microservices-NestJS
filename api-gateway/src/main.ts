import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json());
  app.use(urlencoded({ extended: true }));

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Documentation complète — users-service + orders-service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Récupère les docs des deux services et les fusionne
  const axios = require('axios');
  try {
    const [usersDocs, ordersDocs] = await Promise.all([
      axios.get('http://localhost:3000/api-docs-json'),
      axios.get('http://localhost:3001/api-docs-json'),
    ]);

    // Fusionne les paths et schemas des deux services
    document.paths = {
      ...usersDocs.data.paths,
      ...ordersDocs.data.paths,
    };
    document.components = {
      ...document.components,
      schemas: {
        ...document.components?.schemas,
        ...usersDocs.data.components?.schemas,
        ...ordersDocs.data.components?.schemas,
      }
    };
  } catch (e) {
    console.warn('Impossible de récupérer les docs des services — sont-ils lancés ?');
  }

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3002);
}
bootstrap();