import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Thread } from './threads/entities/thread.entity';
import { Comment } from './comments/entities/comments.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Lädt die .env-Datei global
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'cyber_chat.sqlite',
      entities: [Thread, Comment, User], // User hinzugefügt
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
    }),
    ThreadsModule,
    CommentsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Macht die GESAMTE API standardmäßig dicht!
    },
  ],
})
export class AppModule {}