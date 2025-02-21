import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ValidationError } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { FeatureModule } from './feature.module';
import { AppService } from './app.service';

@Module({
  imports: [
    FeatureModule,
    TranslatesModule.forRootDefault({
      localePaths: [
        join(__dirname, 'assets', 'i18n'),
        join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
      ],
      defaultLocale: 'en',
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
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
