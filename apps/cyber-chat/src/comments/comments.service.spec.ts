/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity';
import { Thread } from '../threads/entities/thread.entity';
import { NotFoundException } from '@nestjs/common';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepoMock: any;
  let threadRepoMock: any;

  // Wir bauen die Mocks für BEIDE Repositories
  const mockCommentRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  };

  const mockThreadRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepoMock = module.get(getRepositoryToken(Comment));
    threadRepoMock = module.get(getRepositoryToken(Thread));
  });

  // --- DER WICHTIGSTE TEST AUS DER AUFGABE ---
  it('should associate comment with a thread and save it successfully', async () => {
    const threadId = 'uuid-thread-123';
    const dto: CreateCommentDto = {
      body: 'Das ist ein Test-Kommentar',
      author: 'Melanie',
    };
    const mockThread = { id: threadId, title: 'Ein toller Thread' };
    const mockNewComment = { ...dto, thread: mockThread };
    const mockSavedComment = { id: 1, ...dto, thread: mockThread };

    // 1. Thread wird gefunden
    threadRepoMock.findOne.mockResolvedValue(mockThread);
    // 2. Kommentar-Entität wird synchron erstellt
    commentRepoMock.create.mockReturnValue(mockNewComment);
    // 3. Kommentar wird in DB gespeichert
    commentRepoMock.save.mockResolvedValue(mockSavedComment);

    const result = await service.create(threadId, dto);

    // Verifizierung der Aufgabenstellung:
    // Wurde der richtige Thread gesucht?
    expect(threadRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: threadId },
    });

    // WURDE DER KOMMENTAR MIT DEM THREAD VERKNÜPFT? (Das ist der verlangte Check!)
    expect(commentRepoMock.create).toHaveBeenCalledWith({
      ...dto,
      thread: mockThread,
    });

    expect(commentRepoMock.save).toHaveBeenCalledWith(mockNewComment);
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException if thread does not exist during creation', async () => {
    threadRepoMock.findOne.mockResolvedValue(null);

    await expect(
      service.create('falsche-id', {
        body: 'Egal',
        author: 'Egal',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(commentRepoMock.create).not.toHaveBeenCalled();
  });

  // --- TEST FÜR FINDONE ---
  it('should return a comment by number id', async () => {
    const mockComment = { id: 42, body: 'Hallo Welt' };
    commentRepoMock.findOne.mockResolvedValue(mockComment);

    const result = await service.findOne(42);

    expect(result.id).toBe(42);
    expect(commentRepoMock.findOne).toHaveBeenCalledWith({ where: { id: 42 } });
  });

  it('should throw NotFoundException if comment to find does not exist', async () => {
    commentRepoMock.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // --- TEST FÜR DEINE SPEZIELLE DELETE LOGIK ---
  it('should change body to "deleted" instead of removing from DB', async () => {
    const mockComment = { id: 5, body: 'Ich fliege gleich raus' };
    commentRepoMock.findOne.mockResolvedValue(mockComment);
    // Bei save() wird das modifizierte Objekt zurückgegeben
    commentRepoMock.save.mockResolvedValue({ id: 5, body: 'deleted' });

    await service.delete(5);

    expect(commentRepoMock.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
    // Prüfen, ob der Body überschrieben und gespeichert wurde
    expect(mockComment.body).toBe('deleted');
    expect(commentRepoMock.save).toHaveBeenCalledWith(mockComment);
  });
});
