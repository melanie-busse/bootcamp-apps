/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: any;
  let usersServiceMock: any;

  // Wir mocken die benötigten Methoden der beiden Services
  const mockAuthService = {
    login: vi.fn(),
  };

  const mockUsersService = {
    create: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get<AuthService>(AuthService);
    usersServiceMock = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- TEST FÜR REGISTER ---
  it('should call usersService.create during registration', async () => {
    const dto: CreateUserDto = { username: 'Melanie', password: 'password123' };
    const mockCreatedUser = { id: 'uuid-1', username: 'Melanie' };

    usersServiceMock.create.mockResolvedValue(mockCreatedUser);

    const result = await controller.register(dto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCreatedUser);
  });

  // --- TEST FÜR LOGIN ---
  it('should return an access token from authService.login', async () => {
    // Passport schleust den User nach erfolgreichem LocalGuard in req.user ein
    const mockRequest = {
      user: { id: 'uuid-1', username: 'Melanie' },
    };
    const mockToken = { access_token: 'jwt-token-123' };

    authServiceMock.login.mockResolvedValue(mockToken);

    const result = await controller.login(mockRequest as any);

    // Der Controller muss req.user an den AuthService übergeben
    expect(authServiceMock.login).toHaveBeenCalledWith(mockRequest.user);
    expect(result).toEqual(mockToken);
  });

  // --- TEST FÜR ME (GET PROFILE) ---
  it('should return the current user object from request', () => {
    const mockRequest = {
      user: { id: 'uuid-1', username: 'Melanie', role: 'developer' },
    };

    // getProfile ist synchron und gibt einfach req.user zurück
    const result = controller.getProfile(mockRequest as any);

    expect(result).toEqual(mockRequest.user);
  });
});
