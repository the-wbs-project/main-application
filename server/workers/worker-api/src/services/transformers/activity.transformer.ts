import { Activity } from '../../models';
import { ActivityViewModel, UserViewModel } from '../../view-models';

export class ActivityTransformer {
  static toViewModelList(activities: Activity[], users: UserViewModel[]): ActivityViewModel[] {
    return activities.map((activity) => this.toViewModel(activity, users));
  }

  static toViewModel(activity: Activity, users: UserViewModel[]): ActivityViewModel {
    return {
      ...activity,
      user: users.find((user) => user.userId === activity.userId),
    };
  }
}
