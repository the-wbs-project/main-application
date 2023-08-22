import { Context } from '../config';
import { Activity, ActivityViewModel, ListItem } from '../models';

export class ActivityService {
  static async toViewModelAsync(ctx: Context, models: Activity[]): Promise<ActivityViewModel[]> {
    const auth = ctx.get('data').auth;
    const userIds: string[] = [];
    //
    //  Get all user IDs
    //
    for (const model of models) {
      if (model.userId && !userIds.includes(model.userId)) userIds.push(model.userId);
    }
    const users = new Map<string, string>();
    const list = await ctx.get('data').lists.getAsync('actions');
    const actions = new Map<string, ListItem>();

    for (const item of list ?? []) {
      actions.set(item.id, item);
    }

    for (const userId of userIds) {
      users.set(userId, (await auth.getLiteUserAsync(userId))?.name ?? '');
    }
    const viewModels: ActivityViewModel[] = [];

    for (const model of models) {
      const action = actions.get(model.action);

      viewModels.push({
        ...model,
        userName: users.get(model.userId) ?? '',
        actionIcon: action?.icon,
        actionDescription: action?.description,
        actionTitle: action?.label ?? action?.title,
      });
      console.log(action);
    }
    return viewModels;
  }
}
