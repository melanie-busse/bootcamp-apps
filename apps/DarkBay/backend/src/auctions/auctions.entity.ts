import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import {Offer} from "../offers/offers.entity";

@Entity('auctions')
export class Auction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: false, length: 150})
    title: string;

    @Column({ type: 'text', nullable: true, length: 500 })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    startPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    currentPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'datetime', nullable: true })
    endDate: Date;

    @Column({type: 'text', nullable: false})
    seller: string;

    // 1-zu-n: Eine Auktion hat viele Gebote (Offers)
    @OneToMany(() => Offer, (offer) => offer.auction)
    offers: Offer[];
}
