import { Injectable } from '@nestjs/common';
import { NestjsTranslatesAsyncLocalStorageData } from 'nestjs-translates';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class AppService {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorage<NestjsTranslatesAsyncLocalStorageData>
  ) {}

  getServiceWord() {
    return this.asyncLocalStorage.getStore()?.translate('word two');
  }
}
