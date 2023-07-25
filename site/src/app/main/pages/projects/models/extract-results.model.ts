import { ListItem, WbsNode } from '@wbs/core/models';

export interface ExtractResults {
  cats: (string | ListItem)[];
  upserts: WbsNode[];
  removeIds: string[];
}
