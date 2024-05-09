import { Breadcrumb } from '../models';

export class ChangeBreadcrumbs {
  static readonly type = '[Settings] Change Breadcrumbs';
  constructor(readonly crumbs: Breadcrumb[]) {}
}
