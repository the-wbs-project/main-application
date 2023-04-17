import { Activity } from '../../models';
import { CosmosDbService } from './cosmos-db.service';
import { Context } from '../../config';

export class UserActivityDataService {
  private _db?: CosmosDbService;

  constructor(private readonly ctx: Context) {}

  getAllAsync(userId: string): Promise<Activity[] | undefined> {
    return this.db.getAllByPartitionAsync<Activity>(userId, false);
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return await this.db.upsertDocument<Activity>(activity, activity.userId);
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      const db = this.ctx.get('organization').organization;
      this._db = new CosmosDbService(this.ctx, db, 'ActivityUsers', 'userId');
    }
    return this._db;
  }
}
