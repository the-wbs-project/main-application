import { Project } from '../models';

export class LoadProjects {
  static readonly type = '[Project List] Load';
}

export class ProjectUpdated {
  static readonly type = '[Project List] Update';
  constructor(readonly project: Project) {}
}
