import { TimelineMenuItem, User } from '../models';

export interface TimelineViewModel {
  id: string;
  objectId: string;
  action: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  user?: User;
  userName?: string;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
  menu: TimelineMenuItem[];
}
