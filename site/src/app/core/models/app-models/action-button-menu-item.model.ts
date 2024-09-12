import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export class ActionButtonMenuItem {
  separator?: true;
  resource?: string;
  text?: string;
  faIcon?: IconDefinition;
  iconSpacer?: boolean;
  route?: string[];
  action?: string;
  disabled?: boolean;
  isHeader?: boolean;
  cssClass?: string | string[];
  items?: ActionButtonMenuItem[];
}
