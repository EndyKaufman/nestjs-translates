import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { isObservable, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  TRANSLATES_CONFIG,
  TranslatesConfig,
} from './nestjs-translates.config';
import { X_SKIP_TRANSLATE } from './nestjs-translates.constants';
import { TranslatesService } from './nestjs-translates.service';
import { NestjsTranslatesAsyncLocalStorageData } from './types/nestjs-translates-async-local-storage-data';

@Injectable()
export class TranslatesInterceptor implements NestInterceptor {
  constructor(
    @Inject(TRANSLATES_CONFIG)
    private readonly translatesConfig: TranslatesConfig,
    private readonly translatesService: TranslatesService,
    private readonly asyncLocalStorage: AsyncLocalStorage<NestjsTranslatesAsyncLocalStorageData>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = this.translatesConfig.contextRequestDetector(context);
    const locale =
      this.translatesConfig.requestLocaleDetector(req) ||
      this.translatesConfig.defaultLocale;

    if (req.headers[X_SKIP_TRANSLATE]) {
      return next.handle();
    }

    const store = {
      nestjsTranslatesLocale: locale,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      translate: (key: string, context?: any) =>
        this.translatesService.translate(key, locale, context || {}),
      translateObject: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Record<string, any> | Record<string, any>[],
        depth: number
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => this.translatesService.translateObject(data, locale, depth || 10),
    };

    const wrapObservableForWorkWithAsyncLocalStorage = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      observable: Observable<any>
    ) =>
      new Observable((observer) => {
        this.asyncLocalStorage.run(store, () => {
          observable.subscribe({
            next: (res) => observer.next(res),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        });
      });

    const run = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = next.handle();

      if (isObservable(result)) {
        return wrapObservableForWorkWithAsyncLocalStorage(result).pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          concatMap(async (data: any) => {
            return this.translatesService.translateObject(data, locale);
          })
        );
      }
      if (result instanceof Promise && typeof result?.then === 'function') {
        return result.then(async (data) => {
          if (isObservable(data)) {
            return wrapObservableForWorkWithAsyncLocalStorage(data).pipe(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              concatMap(async (data: any) => {
                return this.translatesService.translateObject(data, locale);
              })
            );
          } else {
            return this.translatesService.translateObject(
              data,
              locale
              // need for correct map types with base method of NestInterceptor
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as Observable<any>;
          }
        });
      }
      return this.translatesService.translateObject(
        result,
        locale
        // need for correct map types with base method of NestInterceptor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as Observable<any>;
    };

    return run();
  }
}
