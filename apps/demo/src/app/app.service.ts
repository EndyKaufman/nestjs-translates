import { Injectable } from '@nestjs/common';
import { TranslatesAsyncLocalStorageContext } from 'nestjs-translates';

@Injectable()
export class AppService {
  constructor(
    private readonly asyncLocalStorage: TranslatesAsyncLocalStorageContext
  ) {}

  getServiceWord() {
    return this.asyncLocalStorage.get().translate('word two');
  }
}
