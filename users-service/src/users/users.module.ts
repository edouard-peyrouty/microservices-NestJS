import { Module } from '@nestjs/common';
import { UsersController } from '../adapter.in/users.controller';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';

@Module({
  controllers: [UsersController],  // ← reçoit les requêtes HTTP
  providers: [
    UsersService,                  // ← logique métier
    UsersRepository,               // ← accès aux données
  ],
})
export class UsersModule {}