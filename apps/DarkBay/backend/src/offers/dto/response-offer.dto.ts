import {Expose, Transform} from "class-transformer";

export class ResponseOfferDto {
    @Expose()
    id: number;

    @Expose()
    amount: number;

    @Expose()
    bidder: string;

    @Expose()
    createdAt: Date;

    // Diese Transformation sorgt dafür, dass wir dem Client nur die ID
    // der Auktion zurückgeben, statt das ganze Auktions-Objekt zu laden
    @Expose()
    @Transform(({ obj }) => obj.auction?.id)
    auctionId: number;
}