import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { MenuFilter } from './menu-filter.model';

declare type MenuItemBase = {
  text?: string;
  resource?: string;
  faIcon?: IconDefinition | string;
  items?: ContextMenuItem[];
  filters?: MenuFilter;
};

export type ActionContextMenuItem = MenuItemBase & {
  action: string;
};

export type RouteContextMenuItem = MenuItemBase & {
  route: string[];
};

export type ContextMenuItem = ActionContextMenuItem | RouteContextMenuItem;
