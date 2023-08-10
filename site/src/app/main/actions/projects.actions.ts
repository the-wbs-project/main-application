import { Organization, Project } from '@wbs/core/models';

export class LoadProjects {
  static readonly type = '[Projects] Load';
  constructor(readonly organization: Organization) {}
}

export class ProjectUpdated {
  static readonly type = '[Projects] Updated';
  constructor(readonly project: Project) {}
}
