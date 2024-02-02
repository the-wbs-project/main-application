import { BreadCrumbItem } from '@progress/kendo-angular-navigation';

export interface RoutedBreadcrumbItem extends BreadCrumbItem {
  route?: string | string[];
  isText?: boolean;
}
