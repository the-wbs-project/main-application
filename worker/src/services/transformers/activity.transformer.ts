import { Activity, User } from '../../models';
import { ActivityViewModel } from '../../view-models';

export class ActivityTransformer {
  static toViewModelList(activities: Activity[], users: User[]): ActivityViewModel[] {
    return activities.map((activity) => this.toViewModel(activity, users));
  }

  static toViewModel(activity: Activity, users: User[]): ActivityViewModel {
    return {
      ...activity,
      user: users.find((user) => user.userId === activity.userId),
    };
  }
}
