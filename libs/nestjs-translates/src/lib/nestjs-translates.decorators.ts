import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TranslatesConfig } from './nestjs-translates.config';
import { X_SKIP_TRANSLATE } from './nestjs-translates.constants';
import { TranslatesService } from './nestjs-translates.service';
import { getFirstDashedWords } from './utils/get-first-dashed-words';
import { getGlobal } from './utils/get-global.util';

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

export type TranslateFunction = (string: string) => string;

export const InjectTranslateFunction = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = getGlobal<{
      translatesConfig: TranslatesConfig;
    }>().translatesConfig.contextRequestDetector(ctx);
    if (req.headers[X_SKIP_TRANSLATE]) {
      return (word: string) => word;
    }
    const locale =
      getGlobal<{
        translatesConfig: TranslatesConfig;
      }>().translatesConfig.requestLocaleDetector(req) ||
      getGlobal<{ translatesConfig: TranslatesConfig }>().translatesConfig
        .defaultLocale;

    return (word: string) =>
      getGlobal<{
        translatesService: TranslatesService;
      }>().translatesService.translate(word, locale);
  }
);
