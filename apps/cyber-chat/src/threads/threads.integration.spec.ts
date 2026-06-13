/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ThreadsModule } from './threads.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { Comment } from '../comments/entities/comments.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('ThreadsController (Integration)', () => {
  let app: INestApplication;

  // Formale Test-UUIDs, damit die ParseUUIDPipe im Controller glücklich ist
  const validUuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
  const anotherValidUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const mockThreadRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findAndCount: vi.fn(),
    findOne: vi.fn(),
  };

  const mockCommentRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ThreadsModule],
    })
      .overrideProvider(getRepositoryToken(Thread))
      .useValue(mockThreadRepository)
      .overrideProvider(getRepositoryToken(Comment))
      .useValue(mockCommentRepository)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { username: 'Melanie' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // --- TESTFALL 1: POST /threads (Erfolgreich 201) ---
  it('POST /threads -> sollte 201 Created zurückgeben bei validem Body', async () => {
    // Da das DTO 'author' verlangt, schicken wir es im HTTP-Body direkt mit
    const validBody = {
      title: 'Integration Test Title',
      body: 'Das läuft durch den echten Service und ist lang genug!',
      author: 'Melanie',
    };
    const mockSavedThread = { id: validUuid, ...validBody };

    mockThreadRepository.create.mockReturnValue(mockSavedThread);
    mockThreadRepository.save.mockResolvedValue(mockSavedThread);

    const response = await request(app.getHttpServer())
      .post('/threads')
      .send(validBody)
      .expect(201);

    expect(response.body.id).toBe(validUuid);
  });

  // --- TESTFALL 2: POST /threads (Validierungsfehler 400) ---
  it('POST /threads -> sollte 400 Bad Request zurückgeben, wenn Pflichtfelder fehlen', async () => {
    const invalidBody = { body: 'Hier fehlt der Title!' };

    const response = await request(app.getHttpServer())
      .post('/threads')
      .send(invalidBody)
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  // --- TESTFALL 3: GET /threads/:id (Erfolgreich 200) ---
  it('GET /threads/:id -> sollte 200 OK und den gemockten Payload zurückgeben', async () => {
    const mockThread = {
      id: validUuid,
      title: 'Gefundener Thread',
      comments: [],
    };

    mockThreadRepository.findOne.mockResolvedValue(mockThread);

    const response = await request(app.getHttpServer())
      .get(`/threads/${validUuid}`) // Valide UUID übergeben
      .expect(200);

    expect(response.body.id).toBe(validUuid);
    expect(response.body.title).toBe('Gefundener Thread');
  });

  // --- TESTFALL 4: GET /threads/:id (Nicht gefunden 404) ---
  it('GET /threads/:id -> sollte 404 Not Found zurückgeben, wenn Thread nicht existiert', async () => {
    mockThreadRepository.findOne.mockResolvedValue(null);

    await request(app.getHttpServer())
      .get(`/threads/${anotherValidUuid}`) // Formale UUID, die aber null liefert
      .expect(404);
  });
});
