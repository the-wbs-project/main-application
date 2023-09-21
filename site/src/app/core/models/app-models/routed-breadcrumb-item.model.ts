import { BreadCrumbItem } from '@progress/kendo-angular-navigation';

export interface RoutedBreadCrumbItem extends BreadCrumbItem {
  route?: string | string[];
  isText?: boolean;
}
