import { Activity } from '../models/activity.model';

export interface ActivityViewModel extends Activity {
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
}
