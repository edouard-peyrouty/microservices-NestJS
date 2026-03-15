import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from '../adapter.in/users.controller';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { AuthController } from '../adapter.in/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersRepository],
  exports: [JwtModule],
})
export class UsersModule {}