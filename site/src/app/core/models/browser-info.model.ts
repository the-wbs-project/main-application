//From:
//
//  https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts

export interface BrowserInfo {
  name: Browser;
  version: number;
  isMobile: boolean;
}

export type Browser =
  | 'aol'
  | 'edge'
  | 'edge-ios'
  | 'yandexbrowser'
  | 'kakaotalk'
  | 'samsung'
  | 'silk'
  | 'miui'
  | 'beaker'
  | 'edge-chromium'
  | 'chrome'
  | 'chromium-webview'
  | 'phantomjs'
  | 'crios'
  | 'firefox'
  | 'fxios'
  | 'opera-mini'
  | 'opera'
  | 'pie'
  | 'netfront'
  | 'ie'
  | 'bb10'
  | 'android'
  | 'ios'
  | 'safari'
  | 'facebook'
  | 'instagram'
  | 'ios-webview'
  | 'curl'
  | 'searchbot';
