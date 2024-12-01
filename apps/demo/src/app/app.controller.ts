import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  InjectTranslateFunction,
  TranslateFunction,
  TranslatesService,
} from 'nestjs-translates';
import { SampleDto } from './sample.dto';

@Controller()
export class AppController {
  constructor(private readonly translatesService: TranslatesService) {}

  @Get('english-word')
  englishWord() {
    return this.translatesService.translate('word', 'en');
  }

  @Get('russian-word')
  russianWord() {
    return this.translatesService.translate('word', 'ru');
  }

  @Get('translate-word')
  translateWord(@InjectTranslateFunction() getText: TranslateFunction) {
    return getText('word two');
  }

  @Post('validate-dto')
  validateDto(@Body() sampleDto: SampleDto) {
    return sampleDto;
  }
}
