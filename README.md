# nestjs-translates

[![npm version](https://badge.fury.io/js/nestjs-translates.svg)](https://badge.fury.io/js/nestjs-translates)
[![monthly downloads](https://badgen.net/npm/dm/nestjs-translates)](https://www.npmjs.com/package/nestjs-translates)

## Installation

```bash
npm i --save nestjs-translates class-validator-multi-lang class-transformer
```

## Links

https://github.com/EndyKaufman/nestjs-translates - Source code

https://nestjs-translates.site15.ru/api - Demo application with nestjs-translates.

https://dev.to/endykaufman/nestjs-module-for-adding-translations-to-the-application-with-a-pipe-for-translating-validation-errors-2mf3 - Post in dev.to

https://twitter.com/KaufmanEndy/status/1498730314339954695?s=20&t=FwCcltTG-Vxut6M3JVPsCA - Twitter post

## Usage

Update file in **app.module.ts**

```typescript
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
```

Create dictionaries **../assets/i18n/en.json**

```json
{
  "word": "word"
}
```

## License

MIT
