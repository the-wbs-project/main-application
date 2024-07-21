import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type MENU_ITEM_OPS = '=' | '!=' | '>' | '>=' | '<' | '<=';

export interface ContextMenuItem {
  text: string;
  isNotResource?: boolean;
  faIcon: IconDefinition | string;
  action: string;
  items?: ContextMenuItem[];
  filters?: {
    claim?: string;
    stati?: string[];
    props?: [{ prop: string; op: MENU_ITEM_OPS; value: any }];
  };
}
