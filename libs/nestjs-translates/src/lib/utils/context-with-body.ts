import { ExecutionContext } from '@nestjs/common';
import { TranslatesConfig } from '../nestjs-translates.config';
import { getGlobal } from './get-global.util';

export const __NESTJS_TRANSLATES_CONTEXT__ = '__NESTJS_TRANSLATES_CONTEXT__';
export const __NESTJS_TRANSLATES_BODY__ = '__NESTJS_TRANSLATES_BODY__';

export function addContextToBody(context: ExecutionContext) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const req: any = getGlobal<{
    translatesConfig: TranslatesConfig;
  }>().translatesConfig.contextRequestDetector(context);

  req.body = {
    [__NESTJS_TRANSLATES_CONTEXT__]: context,
    [__NESTJS_TRANSLATES_BODY__]: req.body,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getContextFromBody(body: any) {
  return body?.[__NESTJS_TRANSLATES_CONTEXT__];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginalBodyFromBody(body: any) {
  return body?.[__NESTJS_TRANSLATES_BODY__];
}
