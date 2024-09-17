import { Activity } from '../models/activity.model';
import { UserViewModel } from './user.view-model';

export interface ActivityViewModel extends Activity {
  user?: UserViewModel;
}
