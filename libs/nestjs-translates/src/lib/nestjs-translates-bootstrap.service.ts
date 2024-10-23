import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  TranslatesConfig,
  TRANSLATES_CONFIG,
} from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';
import { TranslatesService } from './nestjs-translates.service';

@Injectable()
export class TranslatesBootstrapService implements OnModuleInit {
  constructor(
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  async onModuleInit() {
    this.translatesConfig
      .logger()
      .log('onModuleInit', TranslatesBootstrapService.name);

    this.translatesService.translatesConfig = this.translatesConfig;
    this.translatesStorage.defaultLocale = this.translatesConfig.defaultLocale;

    if (this.translatesConfig.translatesLoader) {
      const translates = await this.translatesConfig.translatesLoader();
      this.translatesStorage.add(translates);
      Object.keys(translates).forEach((locale) =>
        this.translatesConfig
          .logger()
          .log(
            `Add ${
              Object.keys(translates).length
            } translates for locale: ${locale}`,
            TranslatesStorage.name
          )
      );
    }
  }
}
