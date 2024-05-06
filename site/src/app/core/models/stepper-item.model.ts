import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StepperItem {
  label: string;
  icon: IconDefinition;
  optional?: boolean;
  disabled?: boolean;
}
