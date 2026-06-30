import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game.gateway';
import { GameService } from './service/game.service';
import {MatchmakingService} from "./service/matchmaking.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameGateway, GameService, MatchmakingService],
})
export class AppModule {}
