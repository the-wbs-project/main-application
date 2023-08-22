import { Activity } from '../models';

export interface ActivityViewModel extends Activity {
  userName?: string;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
}
