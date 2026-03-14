import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Se connecter et récupérer un token JWT' })
  @ApiResponse({ status: 201, schema: { example: { access_token: 'eyJhbGci...' } } })
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