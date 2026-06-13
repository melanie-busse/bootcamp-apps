/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsRepository } from './threads.repository';
import { describe, it, beforeEach, expect } from 'vitest';

describe('ThreadsRepository', () => {
  let repository: ThreadsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadsRepository],
    }).compile();

    repository = module.get<ThreadsRepository>(ThreadsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // --- TEST FOR CREATE ---
  it('should create and store a new thread with an incremental ID', () => {
    const threadData = {
      title: 'Repo Test',
      author: 'Melanie',
      body: 'In-Memory Content',
    };

    const result = repository.create(threadData);

    expect(result.id).toBe(1);
    expect(result.title).toBe(threadData.title);
    expect(result.createdAt).toBeInstanceOf(Date);

    // Überprüfen, ob es wirklich in der internen Map gelandet ist
    const stored = repository.findOne(1);
    expect(stored).toEqual(result);
  });

  // --- TEST FOR FIND ALL ---
  it('should return all stored threads', () => {
    repository.create({ title: 'T1', author: 'A1', body: 'B1' });
    repository.create({ title: 'T2', author: 'A2', body: 'B2' });

    const allThreads = repository.findAll();

    expect(allThreads).toHaveLength(2);
    expect(allThreads[0].id).toBe(1);
    expect(allThreads[1].id).toBe(2);
  });

  // --- TEST FOR FIND ONE ---
  it('should return undefined if thread does not exist', () => {
    const result = repository.findOne(999);
    expect(result).toBeUndefined();
  });

  // --- TEST FOR DELETE ---
  it('should remove the thread from the internal map', () => {
    const created = repository.create({
      title: 'Lösch mich',
      author: 'A1',
      body: 'B1',
    });
    expect(repository.findOne(created.id)).toBeDefined();

    repository.delete(created.id);

    expect(repository.findOne(created.id)).toBeUndefined();
    expect(repository.findAll()).toHaveLength(0);
  });
});
