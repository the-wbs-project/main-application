import { Context } from '../../config';
import { Activity } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ActivityDataService {
  private _db?: CosmosDbService;

  constructor(private readonly ctx: Context) {}

  getAsync(topLevelId: string, skip: number, take: number): Promise<Activity[] | undefined> {
    return this.db.getListByQueryAsync<Activity>(
      'SELECT * FROM c WHERE c.topLevelId = @TopLevelId ORDER BY c.timestamp desc',
      true,
      [
        {
          name: '@TopLevelId',
          value: topLevelId,
        },
      ],
      skip,
      take,
      true,
    );
  }

  async putAsync(activity: Activity): Promise<void> {
    await this.db.upsertDocument<Activity>(activity, activity.topLevelId);
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      const db = this.ctx.get('organization').organization;
      this._db = new CosmosDbService(this.ctx, db, 'Activity', 'topLevelId');
    }
    return this._db;
  }
}
