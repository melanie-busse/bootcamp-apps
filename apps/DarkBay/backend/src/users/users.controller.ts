import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { WatchlistResponseDto } from './dto/watchlist-response.dto';

@ApiTags('users') // <-- Geändert: Sortiert die Routen jetzt perfekt in deine "users"-Sektion ein
@Controller('users/watchlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ⚠️ HINWEIS: Die 'register'-Route wurde hier entfernt,
  // da sie ohne JWT-Schutz im AuthController leben sollte!

  @Get()
  @ApiOperation({ summary: 'Eigene Merkliste abrufen' })
  @ApiResponse({ status: 200, type: WatchlistResponseDto })
  async getMyWatchlist(@Request() req: any) {
    const userId = req.user.id;
    const userWithWatchlist = await this.usersService.getWatchlist(userId);
    return plainToInstance(WatchlistResponseDto, userWithWatchlist);
  }

  @Post(':auctionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eine Auktion zur Merkliste hinzufügen' })
  @ApiResponse({ status: 200, description: 'Erfolgreich hinzugefügt' })
  async addToWatchlist(
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.usersService.addToWatchlist(userId, auctionId);
    return { message: 'Auktion zur Merkliste hinzugefügt.' };
  }

  @Delete(':auctionId')
  @ApiOperation({ summary: 'Eine Auktion von der Merkliste entfernen' })
  @ApiResponse({ status: 200, description: 'Erfolgreich entfernt' })
  async removeFromWatchlist(
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.usersService.removeFromWatchlist(userId, auctionId);
    return { message: 'Auktion von Merkliste entfernt.' };
  }
}
