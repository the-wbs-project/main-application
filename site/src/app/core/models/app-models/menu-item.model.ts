import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PROJECT_STATI_TYPE } from '../enums';

export interface MenuItem {
  id?: string;
  headTitle?: string;
  headTitle2?: string;
  path?: string[];
  title?: string;
  titleNotResource?: boolean;
  description?: string;
  icon?: string;
  type?: 'link' | 'sub';
  badgeType?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: MenuItem[];
}

export interface ActionMenuItem {
  action: string;
  text?: string;
  icon?: IconDefinition;
  tooltip?: string;
  disabled?: boolean;
  cssClasses?: string;
  filters?: {
    excludeFromCat?: boolean;
    stati?: PROJECT_STATI_TYPE[];
  };
  claim?: string;
}

export interface TimelineMenuItem {
  activityId: string;
  objectId: string;
  action: string;
  title: string;
  icon: string;
}
