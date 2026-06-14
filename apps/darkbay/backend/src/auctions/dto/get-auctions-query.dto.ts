import { IsOptional, IsEnum, IsNumber, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum AuctionStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export class GetAuctionsQueryDto {
    @IsOptional()
    @IsEnum(AuctionStatus)
    status?: AuctionStatus;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    'min-price'?: number; // Bindestrich-Notation laut eurer Anforderung

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    'max-price'?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1; // Standardseite: 1

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit?: number = 10; // Standard-Seitengröße: 10
}