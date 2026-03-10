import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from '../domain/user.entity';
import { CreateUserDto } from '../adapter.in/dto/create-user.dto';
import { UpdateUserDto } from '../adapter.in/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll(): User[] {
    return this.usersRepository.findAll();
  }

  findById(id: string): User {
    const user = this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`);
    return user;
  }

  create(dto: CreateUserDto): User {
    return this.usersRepository.create(dto.nom, dto.email, dto.role);
  }

  update(id: string, dto: UpdateUserDto): User {
    const user = this.usersRepository.update(id, dto);
    if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`);
    return user;
  }

  delete(id: string): void {
    const deleted = this.usersRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Utilisateur ${id} introuvable`);
  }
}