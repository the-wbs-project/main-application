import { HeaderMenuItem } from './menu-item.model';
import { RouteLink } from './route-link.model';

export interface HeaderInformation {
  title: string;
  titleIsResource: boolean;
  breadcrumbs?: RouteLink[];
  activeItem?: string;
  rightButtons?: HeaderMenuItem[];
}
