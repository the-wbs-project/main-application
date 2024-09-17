export type MENU_ITEM_OPS = '=' | '!=' | '>' | '>=' | '<' | '<=';

export interface MenuFilter {
  claim?: string;
  stati?: string[];
  props?: [{ prop: string; op: MENU_ITEM_OPS; value: any }];
}
