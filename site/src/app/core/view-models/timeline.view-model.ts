import { TimelineMenuItem } from '../models';

export interface TimelineViewModel {
  id: string;
  objectId: string;
  action: string;
  data: Record<string, any>;
  timestamp: number;
  userId?: string;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
  menu: TimelineMenuItem[];
}
