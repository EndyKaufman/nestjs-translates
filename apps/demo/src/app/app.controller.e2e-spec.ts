import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidationError } from 'class-validator-multi-lang';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import request from 'supertest';
import { AppController } from './app.controller';

describe('AppController (e2e)', () => {
  jest.setTimeout(3 * 60 * 1000);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TranslatesModule.forRoot(
          getDefaultTranslatesModuleOptions({
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
      .set({ 'accept-language': 'ru' })
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
});
