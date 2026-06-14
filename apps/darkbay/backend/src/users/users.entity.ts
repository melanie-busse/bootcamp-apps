// src/users/users.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable} from 'typeorm';
import {Exclude, Expose} from 'class-transformer';
import {Auction} from "../auctions/auctions.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({ unique: true, type: 'text', nullable: false })
    @Expose()
    username: string;

    @Column()
    @Exclude() // Sorgt dank deines Interceptors dafür, dass das Passwort NIEMALS im Response landet!
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Auction)
    @JoinTable({ name: 'user_watchlists' }) // Erstellt automatisch die Zwischentabelle
    watchlist: Auction[];
}