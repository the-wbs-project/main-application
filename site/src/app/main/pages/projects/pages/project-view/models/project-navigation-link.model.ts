import { Store } from '@ngxs/store';

export interface ProjectNavigationLink {
  fragment?: string;
  action?: { type: string };
  title: string;
  classes?: string[];
  children?: ProjectNavigationLink[];
  claim?: string;
  showIf?: (store: Store) => boolean;
}
