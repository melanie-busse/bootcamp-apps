import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRepositoryToken } from '@nestjs/typeorm'; // <-- NEU
import { Auction } from './auctions/auctions.entity';
import { User } from './users/users.entity'; // <-- NEU (Pfad eventuell anpassen!)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WICHTIG FÜR ANGULAR: CORS aktivieren, damit das Frontend zugreifen darf
  app.enableCors({
      origin: 'https://darkbay.melanie-busse.de',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Globale Validierungs-Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Globaler Serializer
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  // ===================================================================
  // SWAGGER CONFIGURATION (Integrierte API-Dokumentation)
  // ===================================================================
  const config = new DocumentBuilder()
    .setTitle('DarkBay API')
    .setDescription(
      'Die offizielle API-Dokumentation für das Auktionshaus DarkBay',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentifizierung & Login')
    .addTag('users', 'Benutzerverwaltung')
    .addTag('auctions', 'Auktions-Verwaltung')
    .addTag('offers', 'Gebots-Abgabe & Bietlogik')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Gib dein JWT-Token hier ein',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ===================================================================


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
