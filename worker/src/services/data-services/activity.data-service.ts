import { Context } from '../../config';
import { Activity } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ActivityDataService {
  private readonly db: CosmosDbService;

  constructor(ctx: Context) {
    this.db = new CosmosDbService(ctx, 'Activity', 'topLevelId');
  }

  getByTopLevelAsync(topLevelId: string, skip: number, take: number): Promise<Activity[] | undefined> {
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

  getByChildAsync(topLevelId: string, childId: string, skip: number, take: number): Promise<Activity[] | undefined> {
    return this.db.getListByQueryAsync<Activity>(
      'SELECT * FROM c WHERE c.topLevelId = @topLevelId AND c.objectId = @childId ORDER BY c.timestamp desc',
      true,
      [
        {
          name: '@topLevelId',
          value: topLevelId,
        },
        {
          name: '@childId',
          value: childId,
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
}
