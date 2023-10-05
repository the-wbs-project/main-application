import { PermissionFilter } from '@wbs/core/models';

export interface ProjectNavigationLink {
  fragment?: string;
  action?: { type: string };
  title: string;
  classes?: string[];
  children?: ProjectNavigationLink[];
  permissions?: PermissionFilter;
}
