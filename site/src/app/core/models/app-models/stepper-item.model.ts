import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StepperItem {
  id?: string;
  label: string;
  icon: IconDefinition;
  optional?: boolean;
  disabled?: boolean;
}
