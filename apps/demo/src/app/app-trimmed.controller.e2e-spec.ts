import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidationError } from 'class-validator-multi-lang';
import {
  ACCEPT_LANGUAGE,
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController (e2e)', () => {
  jest.setTimeout(3 * 60 * 1000);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TranslatesModule.forRoot(
          getDefaultTranslatesModuleOptions({
            trimLocaleOptions: true,
            localePaths: [
              join(__dirname, '..', 'assets', 'i18n'),
              join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'node_modules',
                'class-validator-multi-lang',
                'i18n'
              ),
            ],
            locales: ['en', 'ru'],
            validationPipeOptions: {
              transform: true,
              validationError: {
                target: false,
                value: false,
              },
              transformOptions: {
                strategy: 'excludeAll',
              },
              exceptionFactory: (errors: ValidationError[]) =>
                new HttpException(errors, HttpStatus.BAD_REQUEST),
            },
          })
        ),
      ],
      providers: [AppService],
      controllers: [AppController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Get english word with TranslatesService', () => {
    return request(app.getHttpServer())
      .get('/english-word')
      .expect(200)
      .expect('word');
  });

  it('Get russian word with TranslatesService', () => {
    return request(app.getHttpServer())
      .get('/russian-word')
      .expect(200)
      .expect('слово');
  });

  it('Use InjectTranslateFunction decorator', () => {
    return request(app.getHttpServer())
      .get('/translate-word')
      .set({ [ACCEPT_LANGUAGE]: 'ru' })
      .expect(200)
      .expect('слово два');
  });

  it('Use InjectTranslateFunction decorator and check custom english translate', () => {
    return request(app.getHttpServer())
      .get('/translate-word')
      .set({ [ACCEPT_LANGUAGE]: 'en-EN' })
      .expect(200)
      .expect('word two in english');
  });
  it('Use AsyncLocalStorage', () => {
    return request(app.getHttpServer())
      .get('/translate-service-word')
      .set({ [ACCEPT_LANGUAGE]: 'ru' })
      .expect(200)
      .expect('слово два');
  });

  it('Use AsyncLocalStorage and check custom english translate', () => {
    return request(app.getHttpServer())
      .get('/translate-service-word')
      .set({ [ACCEPT_LANGUAGE]: 'en-EN' })
      .expect(200)
      .expect('word two in english');
  });

  it('Post empty data (default language: en)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isNotEmpty: 'email should not be empty',
            isEmail: 'email must be an email',
          },
        },
        {
          property: 'password',
          children: [],
          constraints: { isNotEmpty: 'password should not be empty' },
        },
      ]);
  });

  it('Post invalid email data (default language: en)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .send({
        email: 'string',
        password: 'string',
      })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isEmail: 'email must be an email',
          },
        },
      ]);
  });

  it('Post empty data (language: ru)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .set({ [ACCEPT_LANGUAGE]: 'ru' })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isNotEmpty: 'email не может быть пустым',
            isEmail: 'email должен быть email',
          },
        },
        {
          property: 'password',
          children: [],
          constraints: { isNotEmpty: 'password не может быть пустым' },
        },
      ]);
  });

  it('Post invalid email data (language: ru)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .set({ 'Accept-Language': 'ru,en;q=0.9' })
      .send({
        email: 'string',
        password: 'string',
      })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: { isEmail: 'email должен быть email' },
        },
      ]);
  });

  it('Get translated object (language: ru)', () => {
    return request(app.getHttpServer())
      .get('/object')
      .set({ [ACCEPT_LANGUAGE]: 'ru' })
      .expect(200)
      .expect({
        items: [
          {
            id: 1,
            word: 'слово',
          },
        ],
        total: 1,
      });
  });

  it('Get translated object (language: en)', () => {
    return request(app.getHttpServer())
      .get('/object')
      .expect(200)
      .expect({
        items: [
          {
            id: 1,
            word: 'word',
          },
        ],
        total: 1,
      });
  });
});
