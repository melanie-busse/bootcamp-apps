/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsServiceMock: any;

  // Wir mocken den CommentsService mit den beiden benötigten Methoden
  const mockCommentsService = {
    findOne: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    commentsServiceMock = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- TEST FÜR GETONE ---
  it('should convert string ID to number and call commentsService.findOne', async () => {
    const stringId = '42';
    const expectedNumberId = 42;
    commentsServiceMock.findOne.mockResolvedValue({
      id: expectedNumberId,
      body: 'Test Kommentar',
    });

    const result = await controller.getOne(stringId);

    // Testet, ob das Number(id) im Controller korrekt funktioniert hat
    expect(commentsServiceMock.findOne).toHaveBeenCalledWith(expectedNumberId);
    expect(result.id).toBe(expectedNumberId);
  });

  // --- TEST FÜR DELETE ---
  it('should convert string ID to number and call commentsService.delete', async () => {
    const stringId = '100';
    const expectedNumberId = 100;
    commentsServiceMock.delete.mockResolvedValue(undefined);

    await controller.delete(stringId);

    expect(commentsServiceMock.delete).toHaveBeenCalledWith(expectedNumberId);
  });
});
