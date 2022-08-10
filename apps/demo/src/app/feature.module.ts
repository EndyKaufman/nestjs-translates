import {
  Inject,
  Injectable,
  Logger,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { TranslatesModule, TranslatesService } from 'nestjs-translates';
import { join } from 'path';

const FEATURE_SERVICE_CONTEXT = Symbol('FEATURE_SERVICE_CONTEXT');

@Injectable()
export class FeatureService implements OnApplicationBootstrap {
  private readonly logger = new Logger();

  constructor(
    @Inject(FEATURE_SERVICE_CONTEXT)
    private readonly featureServiceContext: string,
    private readonly translatesService: TranslatesService
  ) {}

  onApplicationBootstrap() {
    this.logger.log(
      `OnApplicationBootstrap: ${this.translatesService.translate(
        'word',
        'en'
      )}`,
      `${this.featureServiceContext}:${FeatureService.name}`
    );
  }
}

@Module({
  imports: [TranslatesModule],
  providers: [
    { provide: FEATURE_SERVICE_CONTEXT, useValue: SubFeatureModule.name },
    FeatureService,
  ],
})
export class SubFeatureModule {}

@Module({
  imports: [
    SubFeatureModule,
    TranslatesModule.forFeature({
      localePaths: [join(__dirname, 'assets', 'feature-i18n')],
      defaultLocale: 'en',
      locales: ['en', 'ru'],
      usePipes: false,
    }),
  ],
  providers: [
    { provide: FEATURE_SERVICE_CONTEXT, useValue: FeatureModule.name },
    FeatureService,
  ],
})
export class FeatureModule {}
