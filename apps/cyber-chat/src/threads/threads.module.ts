import { Module } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import {CommentsModule} from "../comments/comments.module";

@Module({
  imports: [CommentsModule],
  providers: [ThreadsRepository, ThreadsService],
  controllers: [ThreadsController]
})
export class ThreadsModule {}
