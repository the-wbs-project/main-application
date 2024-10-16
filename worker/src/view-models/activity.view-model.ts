import { Activity, User } from '../models';

export interface ActivityViewModel extends Activity {
  user?: User;
}
