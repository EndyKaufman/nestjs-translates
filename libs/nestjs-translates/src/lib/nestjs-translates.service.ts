import { Injectable } from '@nestjs/common';
import { render } from 'mustache';
import { TranslatesStorage } from './nestjs-translates.storage';

@Injectable()
export class TranslatesService {
  constructor(private readonly translatesStorage: TranslatesStorage) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translate(key: string, locale: string, context: any = {}) {
    const value =
      (this.translatesStorage.translates[locale] &&
        this.translatesStorage.translates[locale][key]) ||
      key;
    return value ? render(value, context) : value;
  }
}
