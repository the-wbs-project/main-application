import { TimelineMenuItem } from '../models/app-models/menu-item.model';

export interface TimelineViewModel {
  id: string;
  objectId: string;
  action: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  userName?: string;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
  menu: TimelineMenuItem[];
}
