import { RouteLink } from './route-link.model';

export interface HeaderInformation {
  breadcrumbs?: RouteLink[];
  activeItem?: string;
}
