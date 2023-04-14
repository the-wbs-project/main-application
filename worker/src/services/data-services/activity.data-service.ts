import { Activity } from '../../models';
import { DbService } from '../database-services';

export class ActivityDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(topLevelId: string): Promise<Activity[] | undefined> {
    return this.db.getAllByPartitionAsync<Activity>(topLevelId, false);
  }

  async putAsync(activity: Activity): Promise<void> {
    console.log(activity);
    await this.db.upsertDocument<Activity>(activity, activity.topLevelId);
  }
}
