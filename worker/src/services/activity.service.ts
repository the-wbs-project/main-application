import { Context } from '../config';
import { Activity, ActivityViewModel, ListItem } from '../models';

export class ActivityService {
  static async toViewModelAsync(ctx: Context, models: Activity[]): Promise<ActivityViewModel[]> {
    const userIds: string[] = [];
    //
    //  Get all user IDs
    //
    for (const model of models) {
      if (model.userId && !userIds.includes(model.userId)) userIds.push(model.userId);
    }
    const list = await ctx.get('data').lists.getAsync('actions');
    const actions = new Map<string, ListItem>();

    for (const item of list ?? []) {
      actions.set(item.id, item);
    }

    const viewModels: ActivityViewModel[] = [];

    for (const model of models) {
      const action = actions.get(model.action);

      viewModels.push({
        ...model,
        actionIcon: action?.icon,
        actionDescription: action?.description,
        actionTitle: action?.label,
      });
    }
    return viewModels;
  }
}
