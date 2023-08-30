import { Activity } from '../models';

export interface ActivityViewModel extends Activity {
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
}
