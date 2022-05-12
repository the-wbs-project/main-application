import { PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';

export class OpenNodeCreationDialog {
  static readonly type = '[Node Creation] Open Dialog';
  constructor(
    readonly parent: WbsNodeView,
    readonly view: PROJECT_NODE_VIEW_TYPE
  ) {}
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

export class OtherFlagsPrevious {
  static readonly type = '[Node Creation] Other Flags Previous';
}

export class OtherFlagsNext {
  static readonly type = '[Node Creation] Other Flags Next';
  constructor(readonly flags: Record<string, boolean>) {}
}

export class SaveNode {
  static readonly type = '[Node Creation] Save';
}
