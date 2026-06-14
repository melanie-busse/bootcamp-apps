import { Expose, Type } from 'class-transformer';

class WatchlistAuctionDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    currentPrice: number;

    @Expose()
    endDate: Date;
}

export class WatchlistResponseDto {
    @Expose()
    @Type(() => WatchlistAuctionDto)
    watchlist: WatchlistAuctionDto[];
}