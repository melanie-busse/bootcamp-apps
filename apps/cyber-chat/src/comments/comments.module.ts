import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comments.entity'; // Pfad prüfen (mit oder ohne s)
import { Thread } from '../threads/entities/thread.entity';

@Module({
  // WICHTIG: Beide Entities müssen hier für TypeORM registriert werden!
  imports: [TypeOrmModule.forFeature([Comment, Thread])],
  controllers: [CommentsController],
  providers: [CommentsService],
  // Wir exportieren den Service und das TypeOrmModule, falls das ThreadsModule mal spicken muss
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}