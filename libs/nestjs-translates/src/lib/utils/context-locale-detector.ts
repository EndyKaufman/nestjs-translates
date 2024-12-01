import { ExecutionContext } from '@nestjs/common';
import { TranslatesConfig } from '../nestjs-translates.config';
import { getGlobal } from './get-global.util';
import { requestLocaleDetector } from './request-locale-detector';

export function contextLocaleDetector(
  context: ExecutionContext,
  defaultLocale: string
) {
  return requestLocaleDetector(
    getGlobal<{
      translatesConfig: TranslatesConfig;
    }>().translatesConfig.contextRequestDetector(context),
    defaultLocale
  );
}
