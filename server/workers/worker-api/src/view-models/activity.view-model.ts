import { Activity } from '../models';
import { UserViewModel } from './user.view-model';

export interface ActivityViewModel extends Activity {
  user?: UserViewModel;
}
