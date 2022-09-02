import { ListItem, WbsNode } from '@wbs/shared/models';

export interface ExtractResults {
  cats: (string | ListItem)[];
  upserts: WbsNode[];
  removeIds: string[];
}
