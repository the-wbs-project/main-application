import { IconName } from '@fortawesome/fontawesome-svg-core';
import { ListItemBase } from './list-item.model';

export interface ActionDefinition extends ListItemBase {
  title: string;
  description: string;
  icon: IconName;
}
