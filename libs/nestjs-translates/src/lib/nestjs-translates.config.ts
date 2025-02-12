import {
  ExecutionContext,
  Logger,
  ModuleMetadata,
  ValidationPipeOptions,
} from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { contextLocaleDetector } from './utils/context-locale-detector';
import { contextRequestDetector } from './utils/context-request-detector';
import {
  addContextToBody,
  getContextFromBody,
  getOriginalBodyFromBody,
} from './utils/context-with-body';
import { requestLocaleDetector } from './utils/request-locale-detector';

export const TRANSLATES_CONFIG = 'TRANSLATES_CONFIG';

export const TRANSLATES_DEFAULT_LOCALE = 'en';

export interface UsePipesOptions {
  usePipes?: boolean;
  useInterceptors?: boolean;
}

export type TranslatesModuleOptions = ModuleMetadata & UsePipesOptions;

export interface TranslatesConfig {
  defaultLocale: string;

  contextRequestDetector: (context: ExecutionContext) => Request;
  contextLocaleDetector: (context: ExecutionContext) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestLocaleDetector: (request: any) => string;
  translatesLoader: () => Promise<{
    [locale: string]: {
      [key: string]: string;
    };
  }>;
  logger: () => Logger;
  validationPipeOptions?: ValidationPipeOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addContextToBody?: (context: ExecutionContext) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getContextFromBody?: (body: any) => ExecutionContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOriginalBodyFromBody?: (body: any) => any;
}

export type DefaultTranslatesModuleOptions = {
  defaultLocale?: string;
  localePaths: string[];
  vendorLocalePaths?: string[];
  locales: string[];
  validationPipeOptions?: ValidationPipeOptions;
} & Partial<TranslatesConfig>;

export function getDefaultTranslatesModuleOptions({
  defaultLocale,
  localePaths,
  vendorLocalePaths,
  locales,
  validationPipeOptions,
  ...other
}: DefaultTranslatesModuleOptions): TranslatesModuleOptions {
  defaultLocale = defaultLocale || TRANSLATES_DEFAULT_LOCALE;
  if (defaultLocale === undefined) {
    throw new Error('defaultLocale not set');
  }
  return {
    usePipes: true,
    useInterceptors: true,
    providers: [
      {
        provide: TRANSLATES_CONFIG,
        useValue: {
          defaultLocale,
          validationPipeOptions,
          addContextToBody: (context: ExecutionContext) => {
            return addContextToBody(context);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getContextFromBody: (body: any) => {
            return getContextFromBody(body);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getOriginalBodyFromBody: (body: any) => {
            return getOriginalBodyFromBody(body);
          },
          contextRequestDetector: (context: ExecutionContext) => {
            return contextRequestDetector(context);
          },
          contextLocaleDetector: (context: ExecutionContext) => {
            if (defaultLocale === undefined) {
              throw new Error('defaultLocale not set');
            }
            return contextLocaleDetector(context, defaultLocale);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          requestLocaleDetector: (req: any) => {
            if (defaultLocale === undefined) {
              throw new Error('defaultLocale not set');
            }
            return requestLocaleDetector(req, defaultLocale);
          },
          translatesLoader: async () => {
            const translates: {
              [locale: string]: {
                [key: string]: string;
              };
            } = {};
            locales.forEach((locale) => {
              translates[locale] = {};
              localePaths.forEach((path) => {
                const fullPath = resolve(path, `${locale}.json`);
                if (existsSync(fullPath)) {
                  const data: {
                    [key: string]: string;
                  } = JSON.parse(readFileSync(fullPath).toString());
                  translates[locale] = {
                    ...translates[locale],
                    ...data,
                  };
                }
              });
              (vendorLocalePaths || []).forEach((path) => {
                const fullPath = resolve(path, `${locale}.vendor.json`);
                if (existsSync(fullPath)) {
                  const languageFileJson: {
                    [key: string]: {
                      [key: string]: string;
                    };
                  } = JSON.parse(readFileSync(fullPath).toString());
                  translates[locale] = Object.keys(languageFileJson).reduce(
                    (all, scope) => ({ ...all, ...languageFileJson[scope] }),
                    translates[locale] || {}
                  );
                }
              });
            });
            return translates;
          },
          logger: () => new Logger(),
          ...other,
        },
      },
    ],
  };
}
