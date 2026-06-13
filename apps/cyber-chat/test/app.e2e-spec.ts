/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';

describe('App E2E Testing (Full Lifecycle with Better-SQLite3)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Registrierung und Login für die nachfolgenden Testfälle vorbereiten
    const testUser = { username: 'MelanieE2E', password: 'e2e-password-123' };

    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser);

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  // --- TESTFALL 1: THE FULL LIFECYCLE (Happy Path) ---
  it('sollte den gesamten Lebenszyklus durchlaufen (Thread erstellen -> Comment adden -> Get Thread)', async () => {
    expect(authToken).toBeDefined();

    // 1. Thread erstellen
    const newThread = {
      title: 'E2E-Thread Title',
      body: 'Erstellt im vollen Systemtest und lang genug!',
      author: 'MelanieE2E',
    };

    const threadResponse = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newThread)
      .expect(201);

    const generatedThreadId = threadResponse.body.id;
    expect(generatedThreadId).toBeDefined();

    // 2. Einen Kommentar hinzufügen (Mit 'author' für die DTO-Validierung)
    const newComment = {
      body: 'Das ist ein echter E2E-Kommentar!',
      author: 'MelanieE2E',
    };

    await request(app.getHttpServer())
      .post(`/threads/${generatedThreadId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(newComment)
      .expect(201);

    // 3. Den Thread wieder abrufen
    const finalGet = await request(app.getHttpServer())
      .get(`/threads/${generatedThreadId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verifizierungen
    expect(finalGet.body.id).toBe(generatedThreadId);
    expect(finalGet.body.title).toBe('E2E-Thread Title');
    expect(finalGet.body.comments).toBeDefined();
    expect(finalGet.body.comments.length).toBe(1);
    expect(finalGet.body.comments[0].body).toBe(
      'Das ist ein echter E2E-Kommentar!',
    );
  });

  // --- TESTFALL 2: THE ERROR PATH ---
  it('GET /threads/:id -> sollte sicher eine 404 zurückgeben bei einer nicht existierenden UUID', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';

    await request(app.getHttpServer())
      .get(`/threads/${fakeUuid}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});
