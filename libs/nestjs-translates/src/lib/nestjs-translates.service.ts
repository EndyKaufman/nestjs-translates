import { Injectable, Logger } from '@nestjs/common';
import { render } from 'mustache';
import { TranslatesConfig } from './nestjs-translates.config';
import { TranslatesStorage } from './nestjs-translates.storage';

@Injectable()
export class TranslatesService {
  private logger = new Logger(TranslatesService.name);

  translatesConfig?: TranslatesConfig;

  constructor(private readonly translatesStorage: TranslatesStorage) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translate(key: string, locale: string, context: any = {}) {
    if (!key) {
      return key;
    }
    const value =
      (this.translatesStorage.translates[locale] &&
        this.translatesStorage.translates[locale][key]) ||
      key;
    return value ? render(value, context) : value;
  }

  translateObject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oldData: Record<string, any> | Record<string, any>[],
    lang: string,
    depth = 10
  ) {
    if (depth === 0) {
      return oldData;
    }
    if (!oldData) {
      return oldData;
    }
    if (Array.isArray(oldData)) {
      const data = [...oldData];
      const newArray: unknown[] = [];
      for (const item of data) {
        newArray.push(this.translateObject(item, lang, depth - 1));
      }
      return newArray;
    }
    if (
      typeof oldData === 'string' ||
      typeof oldData === 'number' ||
      typeof oldData === 'function'
    ) {
      return oldData;
    }
    try {
      if (typeof oldData === 'object') {
        const data = { ...oldData };
        const keys = Object.keys(data);
        for (const key of keys) {
          const localeKeys = !this.translatesConfig?.localeOptionsKeyResolver
            ? [`${key}Locale`]
            : this.translatesConfig?.localeOptionsKeyResolver(key);
          const localeKeyArray = Array.isArray(localeKeys)
            ? localeKeys
            : [localeKeys];

          if (keys.find((key) => localeKeyArray.includes(key))) {
            for (const localKey of localeKeyArray) {
              if (localKey in data) {
                if (data[localKey]?.[lang]) {
                  data[key] = data?.[localKey]?.[lang];
                }
                if (this.translatesConfig?.trimLocaleOptions) {
                  delete data[localKey];
                }
              } else {
                data[key] = this.translate(data[key], lang) || data[key];
              }
            }
          } else {
            data[key] = this.translateObject(data[key], lang, depth - 1);
          }
        }
        return data;
      }
    } catch (err) {
      this.logger.error(err, err.stack);
    }
    return oldData;
  }
}
