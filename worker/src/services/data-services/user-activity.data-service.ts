import { Context } from '../../config';
import { Activity } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class UserActivityDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'ActivityUsers', 'userId');
  }

  getAllAsync(userId: string): Promise<Activity[] | undefined> {
    return this.db.getAllByPartitionAsync<Activity>(userId, false);
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return await this.db.upsertDocument<Activity>(activity, activity.userId);
  }
}
