import {
  ExecutionContext,
  Logger,
  ModuleMetadata,
  ValidationPipeOptions,
} from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export const TRANSLATES_CONFIG = 'TRANSLATES_CONFIG';

export const TRANSLATES_DEFAULT_LOCALE = 'en';

export interface UsePipesOptions {
  usePipes?: boolean;
}

export type TranslatesModuleOptions = ModuleMetadata & UsePipesOptions;

export interface TranslatesConfig {
  defaultLocale: string;
  contextLocaleDetector: (context: ExecutionContext) => Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestLocaleDetector: (request: any) => Promise<string>;
  translatesLoader: () => Promise<{
    [locale: string]: {
      [key: string]: string;
    };
  }>;
  logger: () => Logger;
  validationPipeOptions?: ValidationPipeOptions;
}

export interface DefaultTranslatesModuleOptions {
  defaultLocale?: string;
  localePaths: string[];
  vendorLocalePaths?: string[];
  locales: string[];
  validationPipeOptions?: ValidationPipeOptions;
}

export function getDefaultTranslatesModuleOptions({
  defaultLocale,
  localePaths,
  vendorLocalePaths,
  locales,
  validationPipeOptions,
}: DefaultTranslatesModuleOptions): TranslatesModuleOptions {
  return {
    usePipes: true,
    providers: [
      {
        provide: TRANSLATES_CONFIG,
        useValue: {
          defaultLocale: defaultLocale || TRANSLATES_DEFAULT_LOCALE,
          validationPipeOptions,
          contextLocaleDetector: async (context: ExecutionContext) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let req: any;
            const contextType: string = context.getType();
            switch (contextType) {
              case 'http':
                req = context.switchToHttp().getRequest();
                break;
              case 'graphql':
                [, , req] = context.getArgs();
                break;
            }
            req = req?.req || req; // todo: fix it
            const locale = (req.raw?.headers ||
              req.headers ||
              req.req?.headers)?.['accept-language'];

            return (locale || defaultLocale).split(',')[0];
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          requestLocaleDetector: async (req: any) => {
            req = req?.req || req || {}; // todo: fix it
            const locale = (req.raw?.headers ||
              req.headers ||
              req.req?.headers)?.['accept-language'];

            return (locale || defaultLocale).split(',')[0];
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
        },
      },
    ],
  };
}
