import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { TranslatesConfig } from './nestjs-translates.config';
import { X_SKIP_TRANSLATE } from './nestjs-translates.constants';
import { TranslatesService } from './nestjs-translates.service';
import { getFirstDashedWords } from './utils/get-first-dashed-words';
import { getGlobal } from './utils/get-global.util';

export const SKIP_TRANSLATE = 'SKIP_TRANSLATE';
export const SkipTranslate = () => SetMetadata(SKIP_TRANSLATE, true);

export const CurrentLocale = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getFirstDashedWords(
      getGlobal<{
        translatesConfig: TranslatesConfig;
      }>().translatesConfig?.contextLocaleDetector(ctx) ||
        getGlobal<{ translatesConfig: TranslatesConfig }>().translatesConfig
          .defaultLocale
    );
  }
);

export const CurrentTranslatesConfig = createParamDecorator(() => {
  return getGlobal<{ translatesConfig: TranslatesConfig }>().translatesConfig;
});

export const CurrentTranslatesRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getGlobal<{
      translatesConfig: TranslatesConfig;
    }>().translatesConfig.contextRequestDetector(ctx);
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslateFunction = (string: string, context?: any) => string;

export const InjectTranslateFunction = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = getGlobal<{
      translatesConfig: TranslatesConfig;
    }>().translatesConfig.contextRequestDetector(ctx);

    if (req?.headers?.[X_SKIP_TRANSLATE]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      return (word: string, context: any = {}) => word;
    }

    const locale =
      getGlobal<{
        translatesConfig: TranslatesConfig;
      }>().translatesConfig.requestLocaleDetector(req) ||
      getGlobal<{ translatesConfig: TranslatesConfig }>().translatesConfig
        .defaultLocale;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (word: string, context: any = {}) =>
      getGlobal<{
        translatesService: TranslatesService;
      }>().translatesService.translate(word, locale, context);
  }
);
