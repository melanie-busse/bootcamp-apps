import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 1. Die Request-Grenze: Strikte Validierung & Whitelisting
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Filtert alle nicht im DTO definierten Properties heraus
            forbidNonWhitelisted: true, // Wirft einen 400 Fehler, wenn unbekannte Felder geschickt werden
            transform: true, // Konvertiert Payloads automatisch in die DTO-Klasseninstanzen
            transformOptions: {
                enableImplicitConversion: true, // Erlaubt implizite Konvertierung (z.B. String zu Number bei query params)
            },
        }),
    );

    // 2. Die Response-Grenze: Exkludiert alle Felder, die nicht im Response-DTO stehen
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            excludeExtraneousValues: true, // Nur Felder mit @Expose() werden serialisiert!
        }),
    );

    // 3. Swagger-Dokumentation (Neu für die Challenge)
    const config = new DocumentBuilder()
        .setTitle('Cyber Chat API')
        .setDescription('Vollständige API-Dokumentation für das Cyber Chat Backend')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description:
                    'Gib dein valides JWT-Token ein, um geschützte Routen zu testen',
                in: 'header',
            },
            'JWT-auth', // Dieser Name wird später bei @ApiBearerAuth('JWT-auth') im Controller genutzt
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    // Registriert die UI unter /api und stellt das rohe JSON unter /api-json bereit
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000, '0.0.0.0');

    // Schicke Konsolen-Logs für den direkten Klick im Terminal
    console.log('🚀 Cyber Chat UI:   http://localhost:3000/api');
    console.log('📄 OpenAPI JSON:    http://localhost:3000/api-json');
}

bootstrap();
