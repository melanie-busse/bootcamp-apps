/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: any;

  const mockUserRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- TEST FÜR CREATE (ERFOLGSFALL) ---
  it('should successfully hash password and save a new user', async () => {
    const dto = { username: 'Melanie', password: 'geheimesPasswort' };
    const mockCreatedUser = {
      username: 'Melanie',
      passwordHash: 'hashed_password',
    };
    const mockSavedUser = { id: 'user-uuid-1', ...mockCreatedUser };

    // 1. Username ist noch frei (gibt null zurück)
    repositoryMock.findOne.mockResolvedValue(null);
    // 2. Synchrones Erstellen der Entity
    repositoryMock.create.mockReturnValue(mockCreatedUser);
    // 3. Speichern in der DB
    repositoryMock.save.mockResolvedValue(mockSavedUser);

    const result = await service.create(dto);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { username: dto.username },
    });

    // Überprüfen, ob das Repository mit einem Passwort-Hash aufgerufen wurde (und nicht mit Klartext!)
    expect(repositoryMock.create).toHaveBeenCalledWith({
      username: dto.username,
      passwordHash: expect.any(String), // Da bcrypt echt hasht, prüfen wir auf irgendeinen String
    });

    expect(repositoryMock.save).toHaveBeenCalledWith(mockCreatedUser);
    expect(result.id).toBe('user-uuid-1');
    expect(result.username).toBe('Melanie');
  });

  // --- TEST FÜR CREATE (CONFLICT EXCEPTION) ---
  it('should throw a ConflictException if username already exists', async () => {
    const dto = { username: 'Melanie', password: 'password123' };
    const existingUser = {
      id: 'existing-id',
      username: 'Melanie',
      passwordHash: 'some-hash',
    };

    // Username existiert bereits!
    repositoryMock.findOne.mockResolvedValue(existingUser);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);

    // Wenn der User existiert, darf weder gehasht, noch create oder save gecallt werden
    expect(repositoryMock.create).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  // --- TEST FÜR FINDBYUSERNAME ---
  it('should return user object if found by username', async () => {
    const mockUser = {
      id: 'uuid-1',
      username: 'Melanie',
      passwordHash: 'hash',
    };
    repositoryMock.findOne.mockResolvedValue(mockUser);

    const result = await service.findByUsername('Melanie');

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { username: 'Melanie' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should return null if user is not found by username', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    const result = await service.findByUsername('Unbekannt');

    expect(result).toBeNull();
  });
});
