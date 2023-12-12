import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';

export interface ContextMenuItem {
  text: string;
  faIcon: IconDefinition;
  action: string;
  filters?: {
    excludeFromCat?: boolean;
    stati?: PROJECT_STATI_TYPE[];
  };
  claim?: string;
}
