import { DataSource } from 'typeorm';
import { Thread } from './threads/entities/thread.entity';
import { Comment } from './comments/entities/comments.entity'; // Pfad genau prüfen!

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'cyber_chat.sqlite',
    entities: [Thread, Comment],
    synchronize: false,
    logging: true,
    migrations: ['src/migrations/*{.ts,.js}'],
});