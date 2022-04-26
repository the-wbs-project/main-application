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

export class TitleDescriptionPrevious {
  static readonly type = '[Node Creation] Title/Description Previous';
}

export class TitleDescriptionNext {
  static readonly type = '[Node Creation] Title/Description Next';
  constructor(readonly title: string, readonly description: string) {}
}

export class PhasePrevious {
  static readonly type = '[Node Creation] Phase Previous';
}

export class PhaseNext {
  static readonly type = '[Node Creation] Phase Next';
  constructor(readonly phase: string) {}
}

export class DisciplinePrevious {
  static readonly type = '[Node Creation] Discipline Previous';
}

export class DisciplineNext {
  static readonly type = '[Node Creation] Discipline Next';
  constructor(readonly disciplines: string[]) {}
}
