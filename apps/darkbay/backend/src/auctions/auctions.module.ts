import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Auction} from "./auctions.entity";
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Auction])],
    controllers: [AuctionsController],
    providers: [AuctionsService],
})
export class AuctionsModule {}
