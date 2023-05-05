import { Project } from '../models';

export class LoadOrganization {
  static readonly type = '[Organization] Load';
  constructor(readonly organization: string) {}
}

export class ProjectUpdated {
  static readonly type = '[Organization] Project Update';
  constructor(readonly project: Project) {}
}
