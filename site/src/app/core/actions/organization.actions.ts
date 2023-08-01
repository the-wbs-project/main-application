import { Project } from '../models';

export class LoadOrganization {
  static readonly type = '[Organization] Load';
  constructor(readonly organizations: string[], readonly selected: string) {}
}

export class ProjectUpdated {
  static readonly type = '[Organization] Project Update';
  constructor(readonly project: Project) {}
}
