import { DynamicModule, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TranslatesBootstrapService } from './nestjs-translates-bootstrap.service';
import {
  TranslatesModuleOptions,
  TRANSLATES_CONFIG,
} from './nestjs-translates.config';
import { TranslatesPipe } from './nestjs-translates.pipe';
import { TranslatesService } from './nestjs-translates.service';
import { TranslatesStorage } from './nestjs-translates.storage';

@Module({
  providers: [TranslatesStorage, TranslatesService],
  exports: [TranslatesStorage, TranslatesService],
})
class TranslatesModuleCore {}

@Module({
  imports: [TranslatesModuleCore],
  exports: [TranslatesModuleCore],
})
export class TranslatesModule {
  static forRoot(options: TranslatesModuleOptions): DynamicModule {
    return {
      module: TranslatesModule,
      ...options,
      providers: [
        ...(options.providers || []),
        TranslatesBootstrapService,
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
      ],
      exports: [...(options.exports || []), TRANSLATES_CONFIG],
    };
  }
}
