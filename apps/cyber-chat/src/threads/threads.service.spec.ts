import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from './threads.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { PaginationQueryDto } from './dto/pagination-query.dto';

describe('ThreadsService', () => {
  let service: ThreadsService;
  let repositoryMock: any;

  // Unser angepasster Mock für deine TypeORM-Methoden
  const mockThreadRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadRepository,
        },
      ],
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
    repositoryMock = module.get(getRepositoryToken(Thread));
  });

  // --- TEST 1: findAll ---
  it('should return paginated threads on findAll', async () => {
    const mockQuery: PaginationQueryDto = {
      page: 1,
      limit: 10,
      sort: '-createdAt',
      author: 'Melanie',
    };
    const mockEntities = [
      { id: 'uuid-1', title: 'Test Thread', author: 'Melanie' },
    ];
    const mockTotal = 1;

    // findAndCount erwartet ein Array bestehend aus [Entities-Array, Gesamtanzahl]
    repositoryMock.findAndCount.mockResolvedValue([mockEntities, mockTotal]);

    const result = await service.findAll(mockQuery);

    expect(result.data).toBeDefined();
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(repositoryMock.findAndCount).toHaveBeenCalledTimes(1);
  });

  // --- TEST 2: findOne mit gültiger ID ---
  it('should return the correct thread object when findOneWithComments is called with valid ID', async () => {
    const mockThread = { id: 'uuid-1', title: 'Gültiger Thread', comments: [] };
    repositoryMock.findOne.mockResolvedValue(mockThread);

    const result = await service.findOneWithComments('uuid-1');

    expect(result.id).toBe('uuid-1');
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 'uuid-1' },
      relations: { comments: true },
    });
  });

  // --- TEST 3: findOne mit ungültiger ID (Exception) ---
  it('should throw a NotFoundException if thread does not exist on findOneWithComments', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(
      service.findOneWithComments('non-existent-id'),
    ).rejects.toThrow(NotFoundException);
  });

  // --- TEST 4: create ---
  it('should pass DTO to repository create and save, then return new thread', async () => {
    const dto = { title: 'Neuer Thread', author: 'Melanie' };
    const mockEntity = { ...dto };
    const savedThread = { id: 'uuid-3', ...dto };

    // Dein Service macht erst .create(dto) und dann .save(entity)
    repositoryMock.create.mockReturnValue(mockEntity);
    repositoryMock.save.mockResolvedValue(savedThread);

    const result = await service.create(dto as any);

    expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    expect(repositoryMock.save).toHaveBeenCalledWith(mockEntity);
    expect(result.id).toBe('uuid-3');
  });

  // --- TEST 5: delete ---
  it('should trigger delete method when author matches', async () => {
    const mockThread = { id: 'uuid-1', author: 'Melanie' };
    repositoryMock.findOne.mockResolvedValue(mockThread);
    repositoryMock.delete.mockResolvedValue({ affected: 1 });

    await service.delete('uuid-1', 'Melanie');

    expect(repositoryMock.delete).toHaveBeenCalledWith('uuid-1');
  });

  // Bonus-Test für deine Absicherung im Service:
  it('should throw ForbiddenException if user tries to delete someone elses thread', async () => {
    const mockThread = { id: 'uuid-1', author: 'FremderUser' };
    repositoryMock.findOne.mockResolvedValue(mockThread);

    await expect(service.delete('uuid-1', 'Melanie')).rejects.toThrow(
      ForbiddenException,
    );
    expect(repositoryMock.delete).not.toHaveBeenCalled();
  });
});
