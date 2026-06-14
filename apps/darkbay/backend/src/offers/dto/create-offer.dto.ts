import { IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateOfferDto {
    @ApiProperty({ example: 65.00, description: 'Die Höhe des neuen Gebots' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: 1, description: 'Die ID der zugehörigen Auktion' })
    @IsInt()
    @IsNotEmpty()
    auctionId: number;
}