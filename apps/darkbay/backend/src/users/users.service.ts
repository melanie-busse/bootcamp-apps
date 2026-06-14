import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

import * as bcrypt from 'bcrypt';
import {RegisterDto} from "../auth/dto/register.dto";
import {Auction} from "../auctions/auctions.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Auction) private readonly auctionsRepository: Repository<Auction>,
    ) {}

    // 1. Neuen User registrieren
    async create(registerDto: RegisterDto): Promise<User> {
        const { username, password } = registerDto;

        // Prüfen, ob der Username bereits existiert
        const existingUser = await this.usersRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new ConflictException('Dieser Benutzername ist bereits vergeben.');
        }

        // Passwort sicher hashen (10 Salt-Runden sind Standard)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // User-Instanz erstellen und speichern
        const user = this.usersRepository.create({
            username,
            passwordHash,
        });

        return await this.usersRepository.save(user);
    }

    // 2. Hilfsmethode für den Login
    async findByUsername(username: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { username } });
    }

    // 3. Merkliste abrufen
    async getWatchlist(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: {
                watchlist: true,
            },
        });
        if (!user) throw new NotFoundException('User nicht gefunden');
        return user;
    }

    // 4. Auktion zur Merkliste hinzufügen
    async addToWatchlist(userId: number, auctionId: number): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: {
                watchlist: true,
            },
        });
        if (!user) throw new NotFoundException('User nicht gefunden');

        const auction = await this.auctionsRepository.findOne({ where: { id: auctionId } });
        if (!auction) throw new NotFoundException('Auktion nicht gefunden');

        // Prüfen, ob die Auktion schon auf der Liste ist
        const alreadyOnList = user.watchlist.some((item) => item.id === auctionId);
        if (alreadyOnList) {
            throw new ConflictException('Diese Auktion steht bereits auf deiner Merkliste');
        }

        user.watchlist.push(auction);
        await this.usersRepository.save(user);
    }

    // 5. Auktion von der Merkliste entfernen
    async removeFromWatchlist(userId: number, auctionId: number): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: {
                watchlist: true,
            },
        });
        if (!user) throw new NotFoundException('User nicht gefunden');

        // Filtere die Auktion heraus
        const originalLength = user.watchlist.length;
        user.watchlist = user.watchlist.filter((item) => item.id !== auctionId);

        if (user.watchlist.length === originalLength) {
            throw new NotFoundException('Auktion war nicht auf deiner Merkliste');
        }

        await this.usersRepository.save(user);
    }
}