import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface MenuItem {
  id?: string;
  headTitle?: string;
  headTitle2?: string;
  path?: string[];
  title?: string;
  titleNotResource?: boolean;
  description?: string;
  icon?: IconDefinition;
  type?: 'link' | 'sub';
  badgeType?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: MenuItem[];
}

export interface ActionMenuItem {
  title?: string;
  tooltip?: string;
  action: string;
  icon?: IconDefinition;
}
