import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ProjectAction {
  separator?: true;
  text?: string;
  icon?: IconDefinition;
  action?: string;
}
