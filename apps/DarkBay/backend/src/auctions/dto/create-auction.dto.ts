import {IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsISO8601, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateAuctionDto {
    @ApiProperty({ example: 'Vintage Schallplattenspieler', description: 'Der Titel der Auktion' })
    @IsString()
    @MaxLength(150)
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Aus den 70ern, voll funktionsfähig.', description: 'Detaillierte Beschreibung' })
    @IsString()
    @MaxLength(500)
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 49.99, description: 'Der Mindestpreis für das erste Gebot' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsNotEmpty()
    startPrice: number;

    @ApiProperty({
        example: '2026-06-15T18:00:00.000Z',
        description: 'ISO-8601 Enddatum der Auktion',
        required: false
    })
    @IsISO8601()
    @IsOptional()
    endDate?: string; // Prüft, ob es ein valides ISO-Datum-Format ist (z.B. 2026-06-04T12:00:00Z)
}