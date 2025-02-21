export type NestjsTranslatesAsyncLocalStorageData = {
  nestjsTranslatesLocale?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translate: (key: string, context?: any) => string;
  translateObject: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | Record<string, any>[],
    depth: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Record<string, any> | Record<string, any>[];
};
