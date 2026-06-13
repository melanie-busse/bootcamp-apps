import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Auction } from '../auctions/auctions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auction])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Ganz wichtig für das spätere AuthModule!
})
export class UsersModule {}
