import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Thread } from '../../threads/entities/thread.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column('text')
    body: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relation: Viele Kommentare gehören zu einem Thread (Many-to-One)
    // onDelete: 'CASCADE' sorgt dafür: Wenn ein Thread gelöscht wird, fliegen alle seine Kommentare automatisch mit raus
    @ManyToOne(() => Thread, (thread) => thread.comments, { onDelete: 'CASCADE' })
    thread: Thread;
}