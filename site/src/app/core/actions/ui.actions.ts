export class MainContentSizeChanged {
  static readonly type = '[UI] Main Content Size Changed';
  constructor(readonly width: number) {}
}

export class ParseNavigation {
  static readonly type = '[UI] Parse Navigation';
  constructor(readonly url: string) {}
}
