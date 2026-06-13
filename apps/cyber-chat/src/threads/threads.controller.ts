import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CommentsService } from '../comments/comments.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(
    private readonly threadService: ThreadsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Ruft alle Chat-Threads ab (paginiert und filterbar)',
  })
  @ApiOkResponse({ description: 'Liste der Threads erfolgreich geladen.' })
  @ApiBadRequestResponse({
    description: 'Ungültige Query-Parameter oder Datumsformat.',
  })
  async getAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('startDate', ParseDatePipe) startDate?: Date,
  ) {
    if (startDate) {
      console.log('Filtere ab Datum:', startDate.toISOString());
    }
    return await this.threadService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Ruft einen spezifischen Thread inklusive seiner Kommentare anhand der ID ab',
  })
  @ApiOkResponse({ description: 'Thread und Kommentare erfolgreich gefunden.' })
  @ApiBadRequestResponse({
    description: 'Die übergebene ID ist keine valide UUID.',
  })
  @ApiNotFoundResponse({
    description: 'Ein Thread mit dieser ID existiert nicht.',
  })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.threadService.findOneWithComments(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Erstellt einen neuen Chat-Thread' })
  @ApiCreatedResponse({
    description: 'Der Thread wurde erfolgreich initialisiert.',
  })
  @ApiBadRequestResponse({
    description: 'Ungültige Eingabedaten (Validierungsfehler).',
  })
  @ApiUnauthorizedResponse({
    description: 'Kein oder ungültiges JWT-Token bereitgestellt.',
  })
  async create(@Body() createThreadDto: CreateThreadDto, @Request() req) {
    createThreadDto.author = req.user.username;
    return await this.threadService.create(createThreadDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Aktualisiert einen bestehenden Thread' })
  @ApiOkResponse({ description: 'Der Thread wurde erfolgreich aktualisiert.' })
  @ApiBadRequestResponse({
    description: 'Ungültige UUID oder fehlerhafte Body-Daten.',
  })
  @ApiUnauthorizedResponse({
    description: 'Nicht autorisiert oder nicht der Besitzer des Threads.',
  })
  @ApiNotFoundResponse({
    description: 'Der zu aktualisierende Thread wurde nicht gefunden.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateThreadDto: UpdateThreadDto,
    @Request() req,
  ) {
    return await this.threadService.update(
      id,
      updateThreadDto,
      req.user.username,
    );
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Fügt einem spezifischen Thread einen Kommentar hinzu',
  })
  @ApiCreatedResponse({
    description: 'Der Kommentar wurde erfolgreich am Thread registriert.',
  })
  @ApiBadRequestResponse({
    description: 'Ungültige UUID oder fehlerhafte Kommentar-Daten.',
  })
  @ApiUnauthorizedResponse({
    description: 'Kein oder ungültiges JWT-Token bereitgestellt.',
  })
  @ApiNotFoundResponse({ description: 'Der Ziel-Thread existiert nicht.' })
  async saveComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    createCommentDto.author = req.user.username;
    return await this.commentsService.create(id, createCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Löscht einen spezifischen Thread' })
  @ApiOkResponse({
    description: 'Der Thread wurde erfolgreich gelöscht (No Content).',
  }) // Status 204
  @ApiBadRequestResponse({
    description: 'Die übergebene ID ist keine valide UUID.',
  })
  @ApiUnauthorizedResponse({
    description: 'Nicht autorisiert oder nicht der Besitzer des Threads.',
  })
  @ApiNotFoundResponse({
    description: 'Der zu löschende Thread wurde nicht gefunden.',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    await this.threadService.delete(id, req.user.username);
  }
}
