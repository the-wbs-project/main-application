import { FileInfo } from '@progress/kendo-angular-upload';
import { ImportPerson, Project, ProjectUploadData } from '@wbs/core/models';
import { PhaseListItem } from '../models';

export class SetProject {
  static readonly type = '[Project Upload] Set Project';
  constructor(readonly project: Project) {}
}

export class SetPageTitle {
  static readonly type = '[Project Upload] Set Page Title';
  constructor(readonly pageTitle: string) {}
}

export class SetAsStarted {
  static readonly type = '[Project Upload] Set As Started';
}

export class FileUploaded {
  static readonly type = '[Project Upload] File Uploaded';
  constructor(readonly file: FileInfo) {}
}

export class LoadProjectFile {
  static readonly type = '[Project Upload] Load Project File';
}

export class CreateJiraTicket {
  static readonly type = '[Project Upload] Create Jira Ticket';
  constructor(readonly description: string) {}
}

export class ProcessFile {
  static readonly type = '[Project Upload] Process File';
}

export class AppendOrOvewriteSelected {
  static readonly type = '[Project Upload] Append/Overwrite Selected';
  constructor(readonly answer: 'append' | 'overwrite') {}
}

export class PeopleCompleted {
  static readonly type = '[Project Upload] People Completed';
  constructor(readonly results: ImportPerson[]) {}
}

export class PrepUploadToSave {
  static readonly type = '[Project Upload] Prep Upload To Save';
}

export class SaveUpload {
  static readonly type = '[Project Upload] Save Upload';
  constructor(readonly results: ProjectUploadData) {}
}
