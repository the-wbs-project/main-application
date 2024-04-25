import { FileInfo } from '@progress/kendo-angular-upload';
import { ImportPerson, ProjectUploadData } from '@wbs/core/models';

export class SetPageTitle {
  static readonly type = '[Library Upload] Set Page Title';
  constructor(readonly pageTitle: string) {}
}

export class SetAsStarted {
  static readonly type = '[Library Upload] Set As Started';
}

export class FileUploaded {
  static readonly type = '[Library Upload] File Uploaded';
  constructor(readonly file: FileInfo) {}
}

export class LoadProjectFile {
  static readonly type = '[Library Upload] Load Project File';
}

export class CreateJiraTicket {
  static readonly type = '[Library Upload] Create Jira Ticket';
  constructor(readonly description: string) {}
}

export class ProcessFile {
  static readonly type = '[Library Upload] Process File';
}

export class AppendOrOvewriteSelected {
  static readonly type = '[Library Upload] Append/Overwrite Selected';
  constructor(readonly answer: 'append' | 'overwrite') {}
}

export class PeopleCompleted {
  static readonly type = '[Library Upload] People Completed';
  constructor(readonly results: ImportPerson[]) {}
}

export class PrepUploadToSave {
  static readonly type = '[Library Upload] Prep Upload To Save';
}

export class SaveUpload {
  static readonly type = '[Library Upload] Save Upload';
  constructor(readonly results: ProjectUploadData) {}
}
