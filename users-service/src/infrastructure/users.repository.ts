import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersRepository {
  private users: User[] = []; // stockage en mémoire pour l'instant

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  create(nom: string, email: string, role: string): User {
    const user = new User(uuidv4(), nom, email, role);
    this.users.push(user);
    return user;
  }

  update(id: string, data: Partial<User>): User | undefined {
    const user = this.findById(id);
    if (!user) return undefined;
    Object.assign(user, data);
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}