import { ACCEPT_LANGUAGE } from '../nestjs-translates.constants';
import { getFirstDashedWords } from './get-first-dashed-words';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requestLocaleDetector(req: any, defaultLocale: string) {
  req = req?.req || req || {}; // todo: fix it
  const locale = (req.raw?.headers || req.headers || req.req?.headers)?.[
    ACCEPT_LANGUAGE
  ];
  return getFirstDashedWords(locale || defaultLocale);
}
