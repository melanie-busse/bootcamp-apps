import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    ParseIntPipe, UseGuards, Request
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ResponseOfferDto } from './dto/response-offer.dto';
import { plainToInstance } from 'class-transformer';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('offers')
@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) {}

    // POST /offers -> Ein neues Gebot für eine Auktion abgeben
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Ein Gebot abgeben', description: 'Gibt ein Gebot ab. Eigenbieten ist verboten.' })
    @ApiResponse({ status: 201, description: 'Gebot erfolgreich platziert.' })
    @ApiResponse({ status: 403, description: 'Verboten: Bieten auf eigene Auktion.' })
    @ApiResponse({ status: 409, description: 'Konflikt: Gebot zu niedrig oder Auktion abgelaufen.' })
    async create(
        @Body() createOfferDto: CreateOfferDto,
        @Request() req: any
    ) {
        const bidderId = req.user.id;
        const bidderName = req.user.username; // Falls du den Namen in der DB speichern willst

        return await this.offersService.createOffer(createOfferDto, bidderId, bidderName);
    }

    // GET /offers/auction/:auctionId -> Den gesamten Gebotsverlauf einer bestimmten Auktion abrufen
    @Get('auction/:auctionId')
    @ApiOperation({ summary: 'Gebotsverlauf einer Auktion abrufen' })
    async findByAuction(@Param('auctionId', ParseIntPipe) auctionId: number): Promise<ResponseOfferDto[]> {
        const offers = await this.offersService.findByAuction(auctionId);
        return plainToInstance(ResponseOfferDto, offers);
    }
}