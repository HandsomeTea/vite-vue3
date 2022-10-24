declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default component;
}

type SupportLanguageType = 'zh-cn' | 'zh-tw' | 'en';

declare interface ExceptionInstance {
  info: string;
  [key: string]: unknown;
}

declare interface HttpException {
  httpInfo: string;
  status: number;
  type?: string;
  error?: ExceptionInstance;
}

declare interface ApiResult {
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: HttpException;
}
