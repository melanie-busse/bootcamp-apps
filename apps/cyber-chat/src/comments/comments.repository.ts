import { Injectable } from '@nestjs/common';
import { Comment } from './interfaces/comments.interfaces';

@Injectable()
export class CommentsRepository {
  // Map-Key: Kommentar-ID (als number). Wert: Der Kommentar selbst.
  private readonly comments = new Map<number, Comment>();

  // Diese Map merkt sich, welcher Kommentar zu welchem Thread gehört:
  // Key: Kommentar-ID -> Wert: Thread-ID
  private readonly commentToThreadMap = new Map<number, number>();

  private currentId = 1;

  // Hier übergeben wir die threadId und die Daten für den neuen Kommentar
  create(
    threadId: number,
    commentData: { author: string; body: string },
  ): Comment {
    const newComment: Comment = {
      id: this.currentId++, // Nutzt die 1 und erhöht danach auf 2
      author: commentData.author,
      body: commentData.body,
      createdAt: new Date(),
    };

    // 1. Kommentar in der Haupt-Map speichern
    this.comments.set(newComment.id, newComment);

    // 2. Die Verknüpfung zum Thread in der zweiten Map speichern
    this.commentToThreadMap.set(newComment.id, threadId);

    return newComment;
  }

  // WICHTIG: Gibt alle Kommentare zurück, die zu einer bestimmten Thread-ID gehören
  findByThreadId(threadId: number): Comment[] {
    const result: Comment[] = [];

    for (const [commentId, tId] of this.commentToThreadMap.entries()) {
      if (tId === threadId) {
        const comment = this.comments.get(commentId);
        if (comment) result.push(comment);
      }
    }

    return result;
  }

  findById(id: number): Comment | undefined {
    return this.comments.get(id);
  }

  // Sonderfall aus der Aufgabe: Löscht den Kommentar nicht, setzt body auf "deleted"
  softDelete(id: number): boolean {
    const comment = this.findById(id);
    if (comment) {
      comment.body = 'deleted';
      return true;
    }
    return false;
  }

  // Hilfsmethode: Wird aufgerufen, wenn ein ganzer Thread gelöscht wird
  deleteByThreadId(threadId: number): void {
    for (const [commentId, tId] of this.commentToThreadMap.entries()) {
      if (tId === threadId) {
        this.comments.delete(commentId);
        this.commentToThreadMap.delete(commentId);
      }
    }
  }
}
