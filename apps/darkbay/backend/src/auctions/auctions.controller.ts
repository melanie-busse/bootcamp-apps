import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Query, UseGuards, Request
} from '@nestjs/common';
import {AuctionsService} from './auctions.service';
import {CreateAuctionDto} from './dto/create-auction.dto';
import {AuctionResponseDto} from './dto/response-auction.dto';
import {plainToInstance} from 'class-transformer';
import {PaginatedAuctionsResponseDto} from "./dto/paginated-auctions-response.dto";
import {GetAuctionsQueryDto} from "./dto/get-auctions-query.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('auctions')
@Controller('auctions')
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {
    }

    // POST /auctions -> Eine neue Auktion anlegen
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth') // <-- Fügt das Schloss-Symbol in Swagger hinzu!
    @ApiOperation({ summary: 'Eine neue Auktion erstellen', description: 'Erstellt eine Auktion für den aktuell eingeloggten User.' })
    @ApiResponse({ status: 201, description: 'Auktion erfolgreich erstellt.' })
    @ApiResponse({ status: 401, description: 'Nicht autorisiert (Token fehlt oder ungültig).' })
    async create(
        @Body() createAuctionDto: CreateAuctionDto,
        @Request() req: any
    ): Promise<AuctionResponseDto> {
        const sellerId = req.user.id;

        const auction = await this.auctionsService.create(createAuctionDto, sellerId);

        return plainToInstance(AuctionResponseDto, auction);
    }

    // GET /auctions -> Alle Auktionen auflisten (inkl. deren Gebote)
    @Get()
    @ApiOperation({ summary: 'Alle Auktionen abrufen (gefiltert & paginiert)' })
    async findAll(@Query() queryDto: GetAuctionsQueryDto): Promise<PaginatedAuctionsResponseDto> {
        const {items, totalItems} = await this.auctionsService.findAll(queryDto);

        const page = queryDto.page ?? 1;
        const limit = queryDto.limit ?? 10;

        const totalPages = Math.ceil(totalItems / limit);

        // Antwort-Objekt zusammenbauen
        const response = {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };

        return plainToInstance(PaginatedAuctionsResponseDto, response);
    }

    // GET /auctions/:id -> Eine einzelne Auktion anhand der ID finden
    @Get(':id')
    @ApiOperation({ summary: 'Eine einzelne Auktion anhand der ID finden' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<AuctionResponseDto> {
        const auction = await this.auctionsService.findOne(id);
        return plainToInstance(AuctionResponseDto, auction);
    }
}