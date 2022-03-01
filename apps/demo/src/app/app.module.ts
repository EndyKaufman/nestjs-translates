import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ValidationError } from 'class-validator-multi-lang';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
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
})
export class AppModule {}
