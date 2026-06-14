import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuctionsModule} from './auctions/auctions.module';
import {OffersModule} from './offers/offers.module';
import {Auction} from "./auctions/auctions.entity";
import {Offer} from "./offers/offers.entity";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: 'darkbay.sqlite',
            entities: [Auction, Offer],
            autoLoadEntities: true,     // Lädt alle Entities, die in den Feature-Modulen registriert sind, automatisch
            synchronize: true,          // ARCHITEKTUR-ANTWORT: Generiert und aktualisiert Tabellen automatisch bei jedem Serverstart
        }),
        AuctionsModule,
        OffersModule,
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {
}