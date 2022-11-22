import { Document, Resource } from '@cfworker/cosmos';
import { Activity } from '../../models';
import { DbService } from '../database-services';
import { DataServiceHelper } from './helper.data-service';

declare type UserActivityDbObject = Activity & Document & Resource;

export class UserActivityDataService {
  constructor(private readonly db: DbService) {}

  async getAllAsync(userId: string): Promise<Activity[]> {
    const dbModels = await this.db.getAllByPartitionAsync<UserActivityDbObject>(userId, false);
    const models: Activity[] = [];

    if (dbModels) for (const dbModel of dbModels) models.push(this.fromDb(dbModel));

    return models;
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return this.fromDb(await this.db.upsertDocument<UserActivityDbObject>(this.toDb(activity), activity.userId));
  }

  private toDb(model: Activity): Partial<UserActivityDbObject> {
    return {
      action: model.action,
      data: model.data,
      id: model.id,
      _ts: 0,
      objectId: model.objectId,
      topLevelId: model.topLevelId,
      userId: model.userId,
      versionId: model.versionId,
      label: model.label,
      labelTitle: model.labelTitle,
    };
  }

  private fromDb(modelDb: UserActivityDbObject): Activity {
    return {
      id: modelDb.id,
      action: modelDb.action,
      data: modelDb.data,
      objectId: modelDb.objectId,
      topLevelId: modelDb.topLevelId,
      userId: modelDb.userId,
      versionId: modelDb.versionId,
      label: modelDb.label,
      labelTitle: modelDb.labelTitle,
      _ts: DataServiceHelper.fixTsValue(modelDb._ts),
    };
  }
}
