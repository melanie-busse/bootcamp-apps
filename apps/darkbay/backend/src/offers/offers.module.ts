import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Offer} from "./offers.entity";
import {Auction} from "../auctions/auctions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Auction])],
  controllers: [OffersController],
  providers: [OffersService]
})
export class OffersModule {}
