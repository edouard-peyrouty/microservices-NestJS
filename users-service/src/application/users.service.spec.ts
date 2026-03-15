import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    // On crée un faux repository (mock) pour ne pas dépendre du vrai
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('doit créer un utilisateur', () => {
      const dto = { nom: 'Edouard', email: 'edouard@test.com', role: 'admin' };
      const fakeUser = { id: 'uuid-1', ...dto };

      jest.spyOn(repository, 'create').mockReturnValue(fakeUser);

      const result = service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto.nom, dto.email, dto.role);
      expect(result).toEqual(fakeUser);
    });
  });

  describe('findAll', () => {
    it('doit retourner la liste de tous les utilisateurs', () => {
        const fakeUsers = [
        { id: 'uuid-1', nom: 'Edouard', email: 'edouard@test.com', role: 'admin' },
        { id: 'uuid-2', nom: 'Jean', email: 'jean@test.com', role: 'user' },
        ];

        jest.spyOn(repository, 'findAll').mockReturnValue(fakeUsers);

        const result = service.findAll();

        expect(result).toEqual(fakeUsers);
        expect(result).toHaveLength(2);
    });

    it('doit retourner un tableau vide si aucun utilisateur', () => {
        jest.spyOn(repository, 'findAll').mockReturnValue([]);

        const result = service.findAll();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('doit retourner un utilisateur existant', () => {
      const fakeUser = { id: 'uuid-1', nom: 'Edouard', email: 'edouard@test.com', role: 'admin' };
      jest.spyOn(repository, 'findById').mockReturnValue(fakeUser);

      const result = service.findById('uuid-1');
      expect(result).toEqual(fakeUser);
    });

    it('doit lancer une NotFoundException si l\'utilisateur n\'existe pas', () => {
      jest.spyOn(repository, 'findById').mockReturnValue(undefined);

      expect(() => service.findById('uuid-inexistant')).toThrow(NotFoundException);
    });
  });

    describe('update', () => {
    it('doit mettre à jour un utilisateur existant', () => {
        const dto = { nom: 'Edouard Modifié' };
        const updatedUser = { id: 'uuid-1', nom: 'Edouard Modifié', email: 'edouard@test.com', role: 'admin' };

        jest.spyOn(repository, 'update').mockReturnValue(updatedUser);

        const result = service.update('uuid-1', dto);

        expect(repository.update).toHaveBeenCalledWith('uuid-1', dto);
        expect(result.nom).toBe('Edouard Modifié');
    });

    it('doit lancer une NotFoundException si l\'utilisateur n\'existe pas', () => {
        jest.spyOn(repository, 'update').mockReturnValue(undefined);

        expect(() => service.update('uuid-inexistant', { nom: 'Test' })).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('doit lancer une NotFoundException si l\'utilisateur n\'existe pas', () => {
      jest.spyOn(repository, 'delete').mockReturnValue(false);

      expect(() => service.delete('uuid-inexistant')).toThrow(NotFoundException);
    });
  });
});