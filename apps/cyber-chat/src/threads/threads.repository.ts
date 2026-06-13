import { Injectable } from '@nestjs/common';
import { Thread } from './interfaces/thread.interfaces';

@Injectable()
export class ThreadsRepository {
  private readonly threads = new Map<number, Thread>();
  private currentId = 1;

  create(threadData: { title: string; author: string; body: string }): Thread {
    const newThread: Thread = {
      id: this.currentId++,
      title: threadData.title,
      author: threadData.author,
      body: threadData.body,
      createdAt: new Date(),
    };

    this.threads.set(newThread.id, newThread);

    return newThread;
  }

  findAll(): Thread[] {
    return Array.from(this.threads.values());
  }

  findOne(id: number): Thread | undefined {
    return this.threads.get(id);
  }

  delete(id: number): void {
    this.threads.delete(id);
  }
}
