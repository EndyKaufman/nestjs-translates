import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  TranslatesConfig,
  TRANSLATES_CONFIG,
} from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';

@Injectable()
export class TranslatesBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(TranslatesBootstrapService.name);

  constructor(
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesStorage: TranslatesStorage
  ) {}

  async onModuleInit() {
    this.translatesConfig
      .logger()
      .log('onModuleInit', TranslatesBootstrapService.name);
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
