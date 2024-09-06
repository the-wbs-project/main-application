import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface DialogStep {
  id: string;
  num: number;
  label: string;
  icon: IconDefinition;
  optional?: boolean;
}
