import { Inject, ValidationError, ValidationPipe } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ValidatorPackage } from '@nestjs/common/interfaces/external/validator-package.interface';
import { ValidatorOptions } from 'class-validator-multi-lang';
import {
  TRANSLATES_CONFIG,
  TranslatesConfig,
} from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';
import { TranslatesAsyncLocalStorageContext } from './types/nestjs-translates-async-local-storage-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let classValidator: ValidatorPackage = {} as any;

@Injectable()
export class TranslatesPipe extends ValidationPipe {
  constructor(
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesAsyncLocalStorageContext: TranslatesAsyncLocalStorageContext
  ) {
    super({
      validatorPackage:
        translatesConfig?.validationPipeOptions?.validatorPackage ||
        require('class-validator-multi-lang'),
      ...(translatesConfig.validationPipeOptions || {}),
    });
    classValidator = this.loadValidator(
      translatesConfig?.validationPipeOptions?.validatorPackage ||
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('class-validator-multi-lang')
    );
  }

  protected override validate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any,
    validatorOptions?: ValidatorOptions
  ): Promise<ValidationError[]> | ValidationError[] {
    if (
      typeof object === 'string' ||
      typeof object === 'number' ||
      typeof object === 'function'
    ) {
      return object;
    }

    const locale =
      this.translatesAsyncLocalStorageContext.get().locale ||
      this.translatesConfig.defaultLocale;

    if (!validatorOptions) {
      validatorOptions = {};
    }

    validatorOptions.messages =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];
    validatorOptions.titles =
      this.translatesStorage.translates[locale] ||
      this.translatesStorage.translates[this.translatesConfig.defaultLocale];

    return classValidator.validate(object, validatorOptions);
  }
}
