import { Injectable } from '@nestjs/common';
import { TRANSLATES_DEFAULT_LOCALE } from './nestjs-translates.config';

@Injectable()
export class TranslatesStorage {
  public defaultLocale: string = TRANSLATES_DEFAULT_LOCALE;
  public locales: string[] = [];

  public translates: {
    [locale: string]: {
      [key: string]: string;
    };
  } = {};

  public addLocale(
    locale: string,
    translates: {
      [key: string]: string;
    }
  ) {
    this.locales.push(locale);
    this.translates[locale] = {
      ...this.translates[locale],
      ...translates,
    };
  }

  public add(translates: {
    [locale: string]: {
      [key: string]: string;
    };
  }) {
    Object.keys(translates).forEach((locale) => {
      this.addLocale(locale, translates[locale]);
    });
  }
}
