import { TimelineMenuItem, UserLite } from '../models';

export interface TimelineViewModel {
  id: string;
  objectId: string;
  action: string;
  data: Record<string, any>;
  timestamp: number;
  user: UserLite;
  menu: TimelineMenuItem[];
}
