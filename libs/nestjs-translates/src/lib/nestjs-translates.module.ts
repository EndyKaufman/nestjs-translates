import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TranslatesBootstrapService } from './nestjs-translates-bootstrap.service';
import {
  DefaultTranslatesModuleOptions,
  getDefaultTranslatesModuleOptions,
  TRANSLATES_CONFIG,
  TranslatesModuleOptions,
  UsePipesOptions,
} from './nestjs-translates.config';
import { TranslatesInterceptor } from './nestjs-translates.interceptor';
import { TranslatesPipe } from './nestjs-translates.pipe';
import { TranslatesService } from './nestjs-translates.service';
import { TranslatesStorage } from './nestjs-translates.storage';
import { TranslatesAsyncLocalStorageContext } from './types/nestjs-translates-async-local-storage-data';
@Module({
  providers: [
    TranslatesStorage,
    TranslatesService,
    TranslatesAsyncLocalStorageContext,
  ],
  exports: [
    TranslatesStorage,
    TranslatesService,
    TranslatesAsyncLocalStorageContext,
  ],
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
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
      ],
      exports: [...(options.exports || []), TRANSLATES_CONFIG],
    };
  }

  static forRootDefault(
    options: DefaultTranslatesModuleOptions & UsePipesOptions
  ): DynamicModule {
    const { providers, usePipes, useInterceptors } =
      getDefaultTranslatesModuleOptions(options);
    if (options.usePipes === undefined) {
      options.usePipes = usePipes;
    }
    if (options.useInterceptors === undefined) {
      options.useInterceptors = useInterceptors;
    }
    return {
      module: TranslatesModule,
      providers: [
        ...(providers || []),
        TranslatesBootstrapService,
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
      ],
      exports: [TRANSLATES_CONFIG],
    };
  }

  static forFeature(
    options: DefaultTranslatesModuleOptions & UsePipesOptions
  ): DynamicModule {
    const { providers } = getDefaultTranslatesModuleOptions(options);
    if (options.usePipes === undefined) {
      options.usePipes = false;
    }
    if (options.useInterceptors === undefined) {
      options.useInterceptors = false;
    }
    return {
      module: TranslatesModule,
      providers: [
        TranslatesStorage,
        TranslatesService,
        ...(providers || []),
        TranslatesBootstrapService,
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
      ],
      exports: [TranslatesStorage, TranslatesService, TRANSLATES_CONFIG],
    };
  }
}
