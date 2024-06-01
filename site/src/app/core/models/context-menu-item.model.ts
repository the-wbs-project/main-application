import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';

export interface ContextMenuItem {
  text: string;
  isNotResource?: boolean;
  faIcon: IconDefinition | string;
  action: string;
  items?: ContextMenuItem[];
  filters?: {
    claim?: string;
    stati?: PROJECT_STATI_TYPE[];
  };
}
