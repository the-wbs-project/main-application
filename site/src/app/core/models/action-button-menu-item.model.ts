import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export class ActionButtonMenuItem {
  separator?: true;
  resource?: string;
  text?: string;
  faIcon?: IconDefinition;
  route?: string[];
  action?: string;
  items?: ActionButtonMenuItem[];
}
