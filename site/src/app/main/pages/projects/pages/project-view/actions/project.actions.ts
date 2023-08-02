import {
  ProjectCategory,
  PROJECT_NODE_VIEW_TYPE,
  ROLES_TYPE,
  UserLite,
  ProjectCategoryChanges,
  PROJECT_STATI,
} from '@wbs/core/models';

export class VerifyProject {
  static readonly type = '[Project] Verify';
  constructor(readonly projectId: string) {}
}

export class SetProject {
  static readonly type = '[Project] Set';
  constructor(readonly projectId: string) {}
}

export class NavigateToView {
  static readonly type = '[Project] Navigate';
  constructor(readonly view: string) {}
}

export class ChangeProjectCategories {
  static readonly type = '[Project] Change Project Categories';
  constructor(
    readonly cType: PROJECT_NODE_VIEW_TYPE,
    readonly changes: ProjectCategoryChanges
  ) {}
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
  constructor(readonly role: ROLES_TYPE, readonly user: UserLite) {}
}

export class RemoveUserToRole {
  static readonly type = '[Project] Remove User To Role';
  constructor(readonly role: ROLES_TYPE, readonly user: UserLite) {}
}

export class MarkProjectChanged {
  static readonly type = '[Project] Mark Changed';
}

export class ChangeProjectStatus {
  static readonly type = '[Project] Change Status';
  constructor(readonly status: PROJECT_STATI) {}
}