import { PROJECT_VIEW_TYPE, WbsNodeView } from '@wbs/models';

export class OpenNodeCreationDialog {
  static readonly type = '[Node Creation] Open Dialog';
  constructor(readonly parent: WbsNodeView, readonly view: PROJECT_VIEW_TYPE) {}
}

export class DialogViewSelected {
  static readonly type = '[Node Creation] View Selected';
  constructor(readonly answer: 'scratch' | 'library') {}
}

export class CloseNodeCreationDialog {
  static readonly type = '[Node Creation] Close Dialog';
}

export class NameDescriptionPrevious {
  static readonly type = '[Node Creation] Name/Description Previous';
}

export class NameDescriptionNext {
  static readonly type = '[Node Creation] Name/Description Next';
  constructor(readonly name: string, readonly description: string) {}
}
