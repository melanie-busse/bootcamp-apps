import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { Thread } from '../threads/entities/thread.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
  ) {}

  async create(
    threadId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
    });
    if (!thread) {
      throw new NotFoundException(
        `Thread mit der ID ${threadId} existiert nicht.`,
      );
    }

    const newComment = this.commentRepository.create({
      ...dto,
      thread,
    });

    const saved = await this.commentRepository.save(newComment);
    return plainToInstance(CommentResponseDto, saved);
  }

  async findOne(id: number): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(
        `Kommentar mit der ID ${id} existiert nicht.`,
      );
    }
    return plainToInstance(CommentResponseDto, comment);
  }

  async delete(id: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(
        `Kommentar mit der ID ${id} existiert nicht.`,
      );
    }

    comment.body = 'deleted';
    await this.commentRepository.save(comment);
  }
}
