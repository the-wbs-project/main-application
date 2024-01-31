import { ListItem, PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';

export class StartWizard {
  static readonly type = '[Library Creation] Start Wizard';
  constructor(readonly owner: string) {}
}

export class SetHeaderInformation {
  static readonly type = '[Library Creation] Set Header Information';
  constructor(readonly title: string, readonly description: string) {}
}

export class SubmitBasics {
  static readonly type = '[Library Creation] Submit Basics';
  constructor(
    readonly title: string,
    //readonly description: string | undefined,
    readonly type: string
  ) {}
}

export class CategoriesChosen {
  static readonly type = '[Library Creation] Categories Chosen';
  constructor(readonly categories: string[]) {}
}

export class LibOrScratchChosen {
  static readonly type = '[Library Creation] Library Or Scratch Chosen';
  constructor(readonly useLibrary: boolean) {}
}

export class NodeViewChosen {
  static readonly type = '[Library Creation] Node View Chosen';
  constructor(readonly nodeView: PROJECT_NODE_VIEW_TYPE) {}
}

export class DisciplinesChosen {
  static readonly type = '[Library Creation] Disciplines Chosen';
  constructor(readonly disciplines: (string | ListItem)[]) {}
}

export class PhasesChosen {
  static readonly type = '[Library Creation] Phases Chosen';
  constructor(readonly phases: (string | ListItem)[]) {}
}

export class RolesChosen {
  static readonly type = '[Library Creation] Roles Chosen';
  constructor(readonly roles: Map<string, string[]>) {}
}

export class SaveProject {
  static readonly type = '[Library Creation] Save Project';
}
