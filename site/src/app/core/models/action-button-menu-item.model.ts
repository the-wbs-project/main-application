import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export class ActionButtonMenuItem {
  separator?: true;
  text?: string;
  faIcon?: IconDefinition;
  route?: string[];
  action?: string;
}
