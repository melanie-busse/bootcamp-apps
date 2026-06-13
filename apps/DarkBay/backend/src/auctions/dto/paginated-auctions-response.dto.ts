import { Expose, Type } from 'class-transformer';
import { AuctionResponseDto } from './response-auction.dto';

class PaginationMetaDto {
    @Expose()
    totalItems: number;

    @Expose()
    itemCount: number;

    @Expose()
    itemsPerPage: number;

    @Expose()
    totalPages: number;

    @Expose()
    currentPage: number;
}

export class PaginatedAuctionsResponseDto {
    @Expose()
    @Type(() => AuctionResponseDto)
    items: AuctionResponseDto[];

    @Expose()
    @Type(() => PaginationMetaDto)
    meta: PaginationMetaDto;
}