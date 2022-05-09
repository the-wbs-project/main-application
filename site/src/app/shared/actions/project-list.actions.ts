import { Project } from '../models';

export class ProjectUpdated {
  static readonly type = '[Project List] Update';
  constructor(readonly project: Project) {}
}
