import { MenuItem } from '@progress/kendo-angular-menu';

export type NavigationLink = MenuItem & {
  route?: string[];
  claim?: string;
};
