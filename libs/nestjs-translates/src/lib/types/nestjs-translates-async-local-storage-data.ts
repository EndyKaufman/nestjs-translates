import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { TranslatesConfig } from '../nestjs-translates.config';

export type TranslatesAsyncLocalStorageData = {
  skipTranslate?: boolean;
  config: TranslatesConfig;
  locale?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translate: (key: string, context?: any) => string;
  translateObject: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | Record<string, any>[],
    depth: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Record<string, any> | Record<string, any>[];
};

@Injectable()
export class TranslatesAsyncLocalStorageContext {
  private storage: AsyncLocalStorage<TranslatesAsyncLocalStorageData>;

  constructor() {
    this.storage = new AsyncLocalStorage();
  }

  get() {
    return this.storage.getStore() as TranslatesAsyncLocalStorageData;
  }

  runWith(context: TranslatesAsyncLocalStorageData, cb: () => void): void {
    return this.storage.run(context, cb);
  }
}
