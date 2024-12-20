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
    const value =
      (this.translatesStorage.translates[locale] &&
        this.translatesStorage.translates[locale][key]) ||
      key;
    return value ? render(value, context) : value;
  }

  translateObject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | Record<string, any>[],
    lang: string,
    depth = 10
  ) {
    if (depth === 0) {
      return data;
    }
    if (Array.isArray(data)) {
      const newArray: unknown[] = [];
      for (const item of data) {
        newArray.push(this.translateObject(item, lang, depth - 1));
      }
      return newArray;
    }
    if (
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'function'
    ) {
      return data;
    }
    try {
      if (typeof data === 'object') {
        const keys = Object.keys(data);
        for (const key of keys) {
          const localKey = `${key}Locale`;
          if (keys.includes(localKey)) {
            if (localKey in data && data[localKey]?.[lang]) {
              data[key] = data?.[localKey]?.[lang];
            } else {
              data[key] = this.translate(data[key], lang) || data[key];
            }
          }
        }
      }
    } catch (err) {
      this.logger.error(err, err.stack);
    }
    return data;
  }
}
