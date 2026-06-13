import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import {Auction} from "../auctions/auctions.entity";

@Entity('offers')
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    bidder: string;

    @CreateDateColumn()
    createdAt: Date;

    // n-zu-1: Viele Gebote gehören zu einer Auktion
    @ManyToOne(() => Auction, (auction) => auction.offers, { onDelete: 'CASCADE' })
    auction: Auction;
}