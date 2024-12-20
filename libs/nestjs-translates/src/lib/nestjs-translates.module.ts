import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TranslatesBootstrapService } from './nestjs-translates-bootstrap.service';
import {
  DefaultTranslatesModuleOptions,
  getDefaultTranslatesModuleOptions,
  TranslatesModuleOptions,
  TRANSLATES_CONFIG,
  UsePipesOptions,
} from './nestjs-translates.config';
import { TranslatesPipe } from './nestjs-translates.pipe';
import { TranslatesService } from './nestjs-translates.service';
import { TranslatesStorage } from './nestjs-translates.storage';
import { TranslatesInterceptor } from './nestjs-translates.interceptor';
import { AsyncLocalStorage } from 'node:async_hooks';

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
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage(),
        },
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
      ],
      exports: [
        ...(options.exports || []),
        TRANSLATES_CONFIG,
        AsyncLocalStorage,
      ],
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
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage(),
        },
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
      ],
      exports: [TRANSLATES_CONFIG, AsyncLocalStorage],
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
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage(),
        },
        ...(options.usePipes
          ? [{ provide: APP_PIPE, useClass: TranslatesPipe }]
          : []),
        ...(options.useInterceptors
          ? [{ provide: APP_INTERCEPTOR, useClass: TranslatesInterceptor }]
          : []),
      ],
      exports: [
        TranslatesStorage,
        TranslatesService,
        TRANSLATES_CONFIG,
        AsyncLocalStorage,
      ],
    };
  }
}
