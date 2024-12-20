import { Inject, ValidationPipe } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { ValidatorOptions } from 'class-validator-multi-lang';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  TRANSLATES_CONFIG,
  TranslatesConfig,
} from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';
import { NestjsTranslatesAsyncLocalStorageData } from './types/nestjs-translates-async-local-storage-data';

@Injectable()
export class TranslatesPipe extends ValidationPipe {
  constructor(
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesStorage: TranslatesStorage,
    private readonly asyncLocalStorage: AsyncLocalStorage<NestjsTranslatesAsyncLocalStorageData>
  ) {
    super({
      validatorPackage: require('class-validator-multi-lang'),
      ...(translatesConfig.validationPipeOptions || {}),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public override async transform(value: any, metadata: ArgumentMetadata) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'function'
    ) {
      return value;
    }
    let reqLocale: string | null = null;

    try {
      const context =
        (this.translatesConfig.getContextFromBody &&
          this.translatesConfig.getContextFromBody(value)) ||
        null;
      if (context) {
        if (this.translatesConfig.getOriginalBodyFromBody) {
          value = this.translatesConfig.getOriginalBodyFromBody(value);
        }
        const req = context
          ? this.translatesConfig.contextRequestDetector(context)
          : null;
        reqLocale = req
          ? this.translatesConfig.requestLocaleDetector(req)
          : null;
      }
    } catch (err) {
      console.error(err, err.stack);
      // ignore all errors
    }

    const locale =
      reqLocale ||
      this.asyncLocalStorage.getStore()?.nestjsTranslatesLocale ||
      this.translatesConfig.defaultLocale;

    (this.validatorOptions as ValidatorOptions).messages =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];
    (this.validatorOptions as ValidatorOptions).titles =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];
    return super.transform(value, metadata);
  }
}
