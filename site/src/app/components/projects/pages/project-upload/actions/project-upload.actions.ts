import { PeopleListItem, PhaseListItem } from '../models';

export class SetPageTitle {
  static readonly type = '[Project Upload] Set Page Title';
  constructor(readonly pageTitle: string) {}
}

export class SetAsStarted {
  static readonly type = '[Project Upload] Set As Started';
}

export class FileUploaded {
  static readonly type = '[Project Upload] File Uploaded';
  constructor(readonly file: File) {}
}

export class LoadProjectFile {
  static readonly type = '[Project Upload] Load Project File';
}

export class ProcessFile {
  static readonly type = '[Project Upload] Process File';
}

export class AppendOrOvewriteSelected {
  static readonly type = '[Project Upload] Append/Overwrite Selected';
  constructor(readonly answer: 'append' | 'overwrite') {}
}

export class PhasesCompleted {
  static readonly type = '[Project Upload] Phases Completed';
  constructor(readonly results: PhaseListItem[]) {}
}

export class PeopleCompleted {
  static readonly type = '[Project Upload] People Completed';
  constructor(readonly results: PeopleListItem[]) {}
}

export class PrepUploadToSave {
  static readonly type = '[Project Upload] Prep Upload To Save';
}
