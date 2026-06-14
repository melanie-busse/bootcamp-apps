import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auctions.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';
import {
  AuctionStatus,
  GetAuctionsQueryDto,
} from './dto/get-auctions-query.dto';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
  ) {}

  // 1. Auktion anlegen
  async create(
    createAuctionDto: CreateAuctionDto,
    sellerId: number,
  ): Promise<Auction> {
    const auction = this.auctionsRepository.create(createAuctionDto);

    auction.seller = sellerId.toString();
    auction.currentPrice = auction.startPrice;

    // GESCHÄFTSREGEL: Wenn kein Enddatum angegeben ist, setze es auf +3 Tage
    if (!auction.endDate) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      auction.endDate = targetDate;
    } else {
      auction.endDate = new Date(auction.endDate);
    }

    // 4. In der SQLite-Datenbank speichern
    return await this.auctionsRepository.save(auction);
  }

  // 2. Alle Auktionen auflisten
  async findAll(
    queryDto: GetAuctionsQueryDto,
  ): Promise<{ items: Auction[]; totalItems: number }> {
    const {
      status,
      page = 1, // Falls undefined, nimm 1
      limit = 10, // Falls undefined, nimm 10
    } = queryDto;

    const minPrice = queryDto['min-price'];
    const maxPrice = queryDto['max-price'];

    // Wir erstellen einen QueryBuilder für komplexe Filterungen
    const queryBuilder = this.auctionsRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.offers', 'offer');

    const nowString = new Date().toISOString();

    // 1. Filter nach Status (offen vs. geschlossen)
    if (status === AuctionStatus.OPEN) {
      // Wir vergleichen den UTC-String direkt mit der Spalte
      queryBuilder.andWhere('auction.endDate > :now', { now: nowString });
    } else if (status === AuctionStatus.CLOSED) {
      queryBuilder.andWhere('auction.endDate <= :now', { now: nowString });
    }

    // 2. Filter nach Mindestpreis
    if (minPrice !== undefined) {
      queryBuilder.andWhere('auction.currentPrice >= :minPrice', { minPrice });
    }

    // 3. Filter nach Maximalpreis
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('auction.currentPrice <= :maxPrice', { maxPrice });
    }

    // 4. Sortierung: Nach Enddatum, neueste (am längsten laufende/als letztes endende) zuerst
    queryBuilder.orderBy('auction.endDate', 'DESC');

    // 5. Paginierung berechnen
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Führt die Query aus und gibt die Einträge + die Gesamtzahl (ohne Limit) zurück
    const [items, totalItems] = await queryBuilder.getManyAndCount();

    return { items, totalItems };
  }

  // 3. Eine einzelne Auktion abrufen
  async findOne(id: number): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({
      where: { id },
      relations: {
        offers: true,
      },
    });

    if (!auction) {
      throw new NotFoundException(`Auktion mit ID ${id} wurde nicht gefunden`);
    }

    return auction;
  }
}
