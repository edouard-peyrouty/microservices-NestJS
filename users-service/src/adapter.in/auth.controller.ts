import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    // Simulation d'authentification
    if (dto.username !== 'admin' || dto.password !== 'password123') {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { username: dto.username, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}