import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export class ActionButtonMenuItem {
  separator?: true;
  text?: string;
  icon?: IconDefinition;
  route?: string[];
  action?: string;
}
