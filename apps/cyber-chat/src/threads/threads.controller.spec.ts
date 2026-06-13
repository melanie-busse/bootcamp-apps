/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { CommentsService } from '../comments/comments.service';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { PaginationQueryDto } from './dto/pagination-query.dto';

describe('ThreadsController', () => {
  let controller: ThreadsController;
  let threadsServiceMock: any;
  let commentsServiceMock: any;

  // Wir erstellen die Mocks für die beiden Services
  const mockThreadsService = {
    findAll: vi.fn(),
    findOneWithComments: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockCommentsService = {
    create: vi.fn(),
  };

  // Wir simulieren das Request-Objekt, das vom JwtAuthGuard kommt
  const mockRequest = {
    user: {
      username: 'Melanie',
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        {
          provide: ThreadsService,
          useValue: mockThreadsService,
        },
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<ThreadsController>(ThreadsController);
    threadsServiceMock = module.get<ThreadsService>(ThreadsService);
    commentsServiceMock = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- TEST FOR GET ALL ---
  it('should call threadService.findAll with query parameters', async () => {
    const query: PaginationQueryDto = { page: 1, limit: 10, sort: 'createdAt' };
    threadsServiceMock.findAll.mockResolvedValue({ data: [], meta: {} });

    const result = await controller.getAll(query);

    expect(threadsServiceMock.findAll).toHaveBeenCalledWith(query);
    expect(result).toBeDefined();
  });

  // --- TEST FOR GET ONE ---
  it('should call threadService.findOneWithComments with correct id', async () => {
    const uuid = 'some-valid-uuid';
    threadsServiceMock.findOneWithComments.mockResolvedValue({
      id: uuid,
      title: 'Test',
    });

    const result = await controller.getOne(uuid);

    expect(threadsServiceMock.findOneWithComments).toHaveBeenCalledWith(uuid);
    expect(result.id).toBe(uuid);
  });

  // --- TEST FOR CREATE ---
  it('should inject the author from request and call threadService.create', async () => {
    const dto = { title: 'Neuer Thread', author: '' };
    threadsServiceMock.create.mockResolvedValue({
      id: '1',
      ...dto,
      author: 'Melanie',
    });

    const result = await controller.create(dto as any, mockRequest);

    // Wichtig: Der Controller manipuliert das DTO und setzt den Author
    expect(dto.author).toBe('Melanie');
    expect(threadsServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result.author).toBe('Melanie');
  });

  // --- TEST FOR UPDATE ---
  it('should call threadService.update with id, dto and username from request', async () => {
    const uuid = 'thread-uuid';
    const dto = { title: 'Geänderter Titel' };
    threadsServiceMock.update.mockResolvedValue({
      id: uuid,
      title: 'Geänderter Titel',
    });

    await controller.update(uuid, dto, mockRequest);

    expect(threadsServiceMock.update).toHaveBeenCalledWith(
      uuid,
      dto,
      'Melanie',
    );
  });

  // --- TEST FOR SAVE COMMENT ---
  it('should inject author to comment dto and call commentsService.create', async () => {
    const threadUuid = 'thread-uuid';
    const commentDto = { body: 'Ein Kommentar', author: '' };
    commentsServiceMock.create.mockResolvedValue({
      id: 1,
      body: 'Ein Kommentar',
    });

    await controller.saveComment(threadUuid, commentDto, mockRequest);

    expect(commentDto.author).toBe('Melanie');
    expect(commentsServiceMock.create).toHaveBeenCalledWith(
      threadUuid,
      commentDto,
    );
  });

  // --- TEST FOR DELETE ---
  it('should call threadService.delete with id and username from request', async () => {
    const uuid = 'thread-uuid';
    threadsServiceMock.delete.mockResolvedValue(undefined);

    await controller.delete(uuid, mockRequest);

    expect(threadsServiceMock.delete).toHaveBeenCalledWith(uuid, 'Melanie');
  });
});
