import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/thread.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
  ) {}

  async create(dto: CreateThreadDto): Promise<ThreadResponseDto> {
    const newThread = this.threadRepository.create(dto);
    const saved = await this.threadRepository.save(newThread);
    return plainToInstance(ThreadResponseDto, saved);
  }

  async findAll(query: PaginationQueryDto) {
    const { page, limit, sort, author } = query;
    const skip = (page - 1) * limit;

    // Sortierung aufbröseln (Bonus)
    const orderDirection = sort.startsWith('-') ? 'DESC' : 'ASC';

    // QueryBuilder oder findAndCount nutzen, um Filter zu setzen (Bonus)
    const whereCondition: any = {};
    if (author) {
      whereCondition.author = author;
    }

    const [entities, total] = await this.threadRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: orderDirection },
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: plainToInstance(ThreadResponseDto, entities),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOneWithComments(id: string): Promise<ThreadResponseDto> {
    const thread = await this.threadRepository.findOne({
      where: { id },
      relations: {
        comments: true,
      } as any,
    });

    if (!thread) {
      throw new NotFoundException(`Thread mit der ID ${id} existiert nicht.`);
    }

    return plainToInstance(ThreadResponseDto, thread);
  }

  async update(
    id: string,
    dto: UpdateThreadDto,
    username: string,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadRepository.findOne({ where: { id } });
    if (!thread) throw new NotFoundException(`Thread nicht gefunden.`);

    if (thread.author !== username) {
      throw new ForbiddenException(
        'Du darfst nur deine eigenen Threads bearbeiten.',
      );
    }

    Object.assign(thread, dto);
    const saved = await this.threadRepository.save(thread);
    return plainToInstance(ThreadResponseDto, saved);
  }

  async delete(id: string, username: string): Promise<void> {
    const thread = await this.threadRepository.findOne({ where: { id } });
    if (!thread) throw new NotFoundException(`Thread nicht gefunden.`);

    if (thread.author !== username) {
      throw new ForbiddenException(
        'Du darfst nur deine eigenen Threads löschen.',
      );
    }

    await this.threadRepository.delete(id);
  }
}
