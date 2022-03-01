import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslatesStorage {
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
