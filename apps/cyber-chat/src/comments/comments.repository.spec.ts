/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsRepository } from './comments.repository';
import { describe, it, beforeEach, expect } from 'vitest';

describe('CommentsRepository', () => {
  let repository: CommentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsRepository],
    }).compile();

    repository = module.get<CommentsRepository>(CommentsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // --- TEST FÜR CREATE & FINDBYID ---
  it('should create a comment and correctly associate it with a thread ID', () => {
    const threadId = 10;
    const commentData = {
      author: 'Melanie',
      body: 'Erster In-Memory Kommentar',
    };

    const result = repository.create(threadId, commentData);

    expect(result.id).toBe(1);
    expect(result.author).toBe(commentData.author);
    expect(result.body).toBe(commentData.body);
    expect(result.createdAt).toBeInstanceOf(Date);

    // Prüfen, ob wir ihn über seine eigene ID finden
    const found = repository.findById(1);
    expect(found).toEqual(result);
  });

  // --- TEST FÜR FINDBYTHREADID ---
  it('should find all comments belonging to a specific thread ID', () => {
    // Zwei Kommentare für Thread 10
    repository.create(10, {
      author: 'User1',
      body: 'Kommentar 1 für Thread 10',
    });
    repository.create(10, {
      author: 'User2',
      body: 'Kommentar 2 für Thread 10',
    });
    // Ein Kommentar für Thread 20
    repository.create(20, { author: 'User3', body: 'Kommentar für Thread 20' });

    const commentsForThread10 = repository.findByThreadId(10);
    const commentsForThread20 = repository.findByThreadId(20);

    expect(commentsForThread10).toHaveLength(2);
    expect(commentsForThread20).toHaveLength(1);
    expect(commentsForThread10[0].id).toBe(1);
    expect(commentsForThread10[1].id).toBe(2);
    expect(commentsForThread20[0].id).toBe(3);
  });

  // --- TEST FÜR SOFTDELETE ---
  it('should not remove comment on softDelete but change body to "deleted"', () => {
    const created = repository.create(10, {
      author: 'Melanie',
      body: 'Originaler Text',
    });

    const success = repository.softDelete(created.id);

    expect(success).toBe(true);
    // Der Kommentar muss immer noch existieren!
    const updatedComment = repository.findById(created.id);
    expect(updatedComment).toBeDefined();
    // Aber der Body muss überschrieben sein
    expect(updatedComment?.body).toBe('deleted');
  });

  it('should return false on softDelete if comment id does not exist', () => {
    const success = repository.softDelete(999);
    expect(success).toBe(false);
  });

  // --- TEST FÜR DELETEBYTHREADID ---
  it('should cascade delete all comments linked to a specific thread ID', () => {
    repository.create(5, { author: 'Melanie', body: 'Wird gelöscht' });
    repository.create(5, { author: 'Melanie', body: 'Wird auch gelöscht' });
    repository.create(6, { author: 'Melanie', body: 'Bleibt bestehen' });

    repository.deleteByThreadId(5);

    expect(repository.findByThreadId(5)).toHaveLength(0);
    expect(repository.findByThreadId(6)).toHaveLength(1);
    expect(repository.findById(1)).toBeUndefined();
    expect(repository.findById(2)).toBeUndefined();
    expect(repository.findById(3)).toBeDefined();
  });
});
