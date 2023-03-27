import { Document, Resource } from '@cfworker/cosmos';
import { Activity } from '../../models';
import { DbService } from '../database-services';
import { DataServiceHelper } from './helper.data-service';

export class UserActivityDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(userId: string): Promise<Activity[] | undefined> {
    return this.db.getAllByPartitionAsync<Activity>(userId, false);
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return await this.db.upsertDocument<Activity>(activity, activity.userId);
  }
}
