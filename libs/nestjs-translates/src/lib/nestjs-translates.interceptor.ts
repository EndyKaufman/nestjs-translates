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

    try {
      if (this.translatesConfig.addContextToBody) {
        this.translatesConfig.addContextToBody(context);
      }
    } catch (err) {
      console.error(err, err.stack);
      // ignore all errors
    }

    const run = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = next.handle();

      if (isObservable(result)) {
        return result.pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          concatMap(async (data: any) => {
            return this.translatesService.translateObject(data, locale);
          })
        );
      }
      if (result instanceof Promise && typeof result?.then === 'function') {
        return result.then(async (data) => {
          if (isObservable(data)) {
            return data.pipe(
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

    return this.asyncLocalStorage.run(
      { nestjsTranslatesLocale: locale },
      () => {
        return run();
      }
    );
  }
}
