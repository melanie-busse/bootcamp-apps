import {Injectable, NotFoundException, ConflictException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offers.entity';
import { Auction } from '../auctions/auctions.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer) private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Auction) private readonly auctionRepository: Repository<Auction>,
    ) {}

    async createOffer(createOfferDto: CreateOfferDto, bidderId: number, bidderName: string): Promise<Offer> {
        const { amount, auctionId } = createOfferDto;

        const auction = await this.auctionRepository.findOne({
            where: { id: auctionId },
        });

        if (!auction) {
            throw new NotFoundException(`Auktion mit ID ${auctionId} wurde nicht gefunden`);
        }

        // 1.5 GESCHÄFTSREGEL-UPGRADE: Eigenbieten verhindern!
        // Wir vergleichen den Bieter aus dem Token mit dem Verkäufer der Auktion
        if (auction.seller === bidderId.toString()) {
            throw new ForbiddenException('Gebot abgelehnt: Du kannst nicht auf deine eigene Auktion bieten!');
        }

        // 2. RANDFALL: Ist die Auktion bereits abgelaufen?
        const now = new Date();
        if (auction.endDate && now > auction.endDate) {
            throw new ConflictException('Gebot abgelehnt: Diese Auktion ist bereits abgelaufen.');
        }

        // 3. RANDFALL: Ist es das allererste Gebot und liegt unter dem Startpreis?
        // Oder gibt es schon ein Gebot, aber das neue überbietet den aktuellen Preis nicht strikt?
        if (auction.currentPrice) {
            // Es gab schon ein Gebot -> Das neue Gebot muss STRIKT überbieten
            if (amount <= auction.currentPrice) {
                throw new ConflictException(
                    `Gebot abgelehnt: Das Gebot von ${amount} muss den aktuellen Preis von ${auction.currentPrice} strikt überbieten.`,
                );
            }
        } else {
            // Es ist das erste Gebot -> Muss mindestens dem Startpreis entsprechen
            if (amount < auction.startPrice) {
                throw new ConflictException(
                    `Gebot abgelehnt: Das erste Gebot muss mindestens dem Startpreis von ${auction.startPrice} entsprechen.`,
                );
            }
        }

        const newOffer = this.offerRepository.create({
            amount,
            bidder: bidderName,
            auction,
        });

        const savedOffer = await this.offerRepository.save(newOffer);

        // C. Die Auktion aktualisieren: Der currentPrice zieht auf den neuen Höchstbetrag mit
        auction.currentPrice = amount;
        await this.auctionRepository.save(auction);

        return savedOffer;
    }

    // Hilfsmethode: Alle Gebote einer bestimmten Auktion anzeigen (für den Verlauf)
    async findByAuction(auctionId: number): Promise<Offer[]> {
        return await this.offerRepository.find({
            where: { auction: { id: auctionId } },
            order: { createdAt: 'DESC' }, // Neueste Gebote zuerst
        });
    }
}