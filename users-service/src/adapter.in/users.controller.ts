import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('users')        // ← groupe les routes sous "users" dans Swagger
@ApiBearerAuth()         
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(): UserResponseDto[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  findById(@Param('id') id: string): UserResponseDto {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() dto: CreateUserDto): UserResponseDto {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): UserResponseDto {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 204, description: 'Supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    return this.usersService.delete(id);
  }
}