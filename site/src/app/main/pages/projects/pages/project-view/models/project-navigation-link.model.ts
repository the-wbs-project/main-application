import { MenuItem } from '@progress/kendo-angular-menu';

export type ProjectNavigationLink = MenuItem & {
  route?: string[];
  claim?: string;
};
