import {Expose, Type} from "class-transformer";
import {ResponseOfferDto} from "../../offers/dto/response-offer.dto";

export class AuctionResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    startPrice: number;

    @Expose()
    currentPrice: number;

    @Expose()
    createdAt: Date;

    @Expose()
    endDate: Date;

    @Expose()
    seller: string;

    // Hier mappen wir das Array der Gebote sauber mit
    @Expose()
    @Type(() => ResponseOfferDto)
    offers: ResponseOfferDto[];
}