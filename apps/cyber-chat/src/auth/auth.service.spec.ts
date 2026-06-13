/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: any;
  let jwtServiceMock: any;

  // Mock für den UsersService
  const mockUsersService = {
    findByUsername: vi.fn(),
  };

  // Mock für den NestJS JwtService
  const mockJwtService = {
    sign: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersServiceMock = module.get<UsersService>(UsersService);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- TESTS FÜR validateUser ---
  describe('validateUser', () => {
    it('should return user object without password if credentials are valid', async () => {
      const password = 'supersecretpassword';
      // Wir generieren einen echten Hash, damit bcrypt.compare im Service erfolgreich ist
      const passwordHash = await bcrypt.hash(password, 10);

      const mockUser = { id: 'user-uuid-1', username: 'Melanie', passwordHash };
      usersServiceMock.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('Melanie', password);

      expect(usersServiceMock.findByUsername).toHaveBeenCalledWith('Melanie');
      expect(result).toEqual(mockUser);
    });

    it('should return null if password does not match', async () => {
      const passwordHash = await bcrypt.hash('richtigesPasswort', 10);
      const mockUser = { id: 'user-uuid-1', username: 'Melanie', passwordHash };
      usersServiceMock.findByUsername.mockResolvedValue(mockUser);

      // Wir übergeben das falsche Passwort 'falschesPasswort'
      const result = await service.validateUser('Melanie', 'falschesPasswort');

      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      usersServiceMock.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('GibtsNicht', 'egal');

      expect(result).toBeNull();
    });
  });

  // --- TESTS FÜR login ---
  describe('login', () => {
    it('should generate a payload and return an access token', async () => {
      const mockUser = { id: 'user-uuid-1', username: 'Melanie' };
      const expectedToken = 'mocked-jwt-token-xyz';

      jwtServiceMock.sign.mockReturnValue(expectedToken);

      const result = await service.login(mockUser);

      // Prüfen, ob das Payload korrekt für den JwtService zusammengebaut wurde
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });

      // Prüfen, ob die Response-Struktur stimmt
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });
  });
});
