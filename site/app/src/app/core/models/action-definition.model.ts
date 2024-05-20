import { ListItemBase } from './list-item.model';

export interface ActionDefinition extends ListItemBase {
  title: string;
  description: string;
  icon: string;
}
