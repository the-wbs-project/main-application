import {
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_STATI,
  ProjectCategoryChanges,
  User,
} from '@wbs/core/models';

export class VerifyProject {
  static readonly type = '[Project] Verify';
  constructor(readonly owner: string, readonly projectId: string) {}
}

export class SetProject {
  static readonly type = '[Project] Set';
  constructor(readonly owner: string, readonly projectId: string) {}
}

export class NavigateToView {
  static readonly type = '[Project] Navigate';
  constructor(readonly view: string) {}
}

export class SetNavSection {
  static readonly type = '[Project] Set Nav Section';
  constructor(readonly navSection: string | undefined) {}
}

export class ChangeProjectDiscipines {
  static readonly type = '[Project] Change Project Disciplines';
  constructor(readonly changes: ProjectCategoryChanges) {}
}

export class ChangeProjectBasics {
  static readonly type = '[Project] Change Project Basics';
  constructor(
    readonly title: string,
    readonly description: string,
    readonly category: string
  ) {}
}

export class AddUserToRole {
  static readonly type = '[Project] Add User To Role';
  constructor(readonly role: string, readonly user: User) {}
}

export class RemoveUserToRole {
  static readonly type = '[Project] Remove User To Role';
  constructor(readonly role: string, readonly user: User) {}
}

export class MarkProjectChanged {
  static readonly type = '[Project] Mark Changed';
}

export class ChangeProjectStatus {
  static readonly type = '[Project] Change Status';
  constructor(readonly status: PROJECT_STATI) {}
}

export class ArchiveProject {
  static readonly type = '[Project] Archive';
}
