import { Inject, Scope, ValidationPipe } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { REQUEST } from '@nestjs/core';
import { ValidatorOptions } from 'class-validator-multi-lang';
import {
  TranslatesConfig,
  TRANSLATES_CONFIG,
} from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';

@Injectable({ scope: Scope.REQUEST })
export class TranslatesPipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST)
    private readonly req,
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesStorage: TranslatesStorage
  ) {
    super({
      validatorPackage: require('class-validator-multi-lang'),
      ...(translatesConfig.validationPipeOptions || {}),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public override async transform(value: any, metadata: ArgumentMetadata) {
    let locale = this.translatesConfig.defaultLocale;
    if (this.req) {
      locale = await this.translatesConfig.requestLocaleDetector(this.req);
    }
    (this.validatorOptions as ValidatorOptions).messages =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];
    (this.validatorOptions as ValidatorOptions).titles =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];
    return super.transform(value, metadata);
  }
}
