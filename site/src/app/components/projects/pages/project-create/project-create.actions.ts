import { ListItem, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';

export class StartWizard {
  static readonly type = '[Project Creation] Start Wizard';
}

export class NavBack {
  static readonly type = '[Project Creation] Navigate Back';
}

export class GoToBasics {
  static readonly type = '[Project Creation] Go To Basics';
}

export class SubmitBasics {
  static readonly type = '[Project Creation] Submit Basics';
  constructor(readonly title: string, readonly description: string) {}
}

export class LibOrScratchChosen {
  static readonly type = '[Project Creation] Library Or Scratch Chosen';
  constructor(readonly useLibrary: boolean) {}
}

export class NodeViewChosen {
  static readonly type = '[Project Creation] Node View Chosen';
  constructor(readonly nodeView: PROJECT_NODE_VIEW_TYPE) {}
}

export class DisciplinesChosen {
  static readonly type = '[Project Creation] Disciplines Chosen';
  constructor(readonly disciplines: (string | ListItem)[]) {}
}

export class PhasesChosen {
  static readonly type = '[Project Creation] Phases Chosen';
  constructor(readonly phases: (string | ListItem)[]) {}
}

export class SaveProject {
  static readonly type = '[Project Creation] Save Project';
}