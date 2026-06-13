import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Comment } from '../../comments/entities/comments.entity';

@Entity('threads')
export class Thread {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    body: string;

    @Column()
    author: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relation: Ein Thread hat viele Kommentare (One-to-Many)
    // cascade: true sorgt dafür, dass abhängige Operationen mitübergeben werden
    @OneToMany(() => Comment, (comment) => comment.thread, { cascade: true })
    comments: Comment[];
}