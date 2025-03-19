import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  InjectTranslateFunction,
  SkipTranslate,
  TranslateFunction,
  TranslatesService,
} from 'nestjs-translates';
import { AppService } from './app.service';
import { SampleDto } from './sample.dto';

@Controller()
export class AppController {
  constructor(
    private readonly translatesService: TranslatesService,
    private readonly appService: AppService
  ) {}

  @Get('english-word')
  englishWord() {
    return this.translatesService.translate('word', 'en');
  }

  @Get('russian-word')
  russianWord() {
    return this.translatesService.translate('word', 'ru');
  }

  @SkipTranslate()
  @Get('skip-translate-object')
  skipTranslateObject() {
    return this.appService.getObject();
  }

  @Get('object')
  object() {
    return this.appService.getObject();
  }

  @Get('translate-word')
  translateWord(@InjectTranslateFunction() getText: TranslateFunction) {
    return getText('word two');
  }

  @Post('validate-dto')
  validateDto(@Body() sampleDto: SampleDto) {
    return sampleDto;
  }

  @Get('translate-service-word')
  async translateServiceWord() {
    return this.appService.getServiceWord();
  }
}
