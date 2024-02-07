import { MenuItem } from '@progress/kendo-angular-menu';

export type NavigationLink = MenuItem & {
  section?: string;
  route?: string[];
  claim?: string;
};
