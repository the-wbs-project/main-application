import { TimelineMenuItem } from '../models/app-models/menu-item.model';
import { UserViewModel } from './user.view-model';

export interface TimelineViewModel {
  id: string;
  objectId: string;
  action: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  user?: UserViewModel;
  userName?: string;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
  menu: TimelineMenuItem[];
}
