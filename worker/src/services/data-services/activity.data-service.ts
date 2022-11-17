import { Document, Resource } from '@cfworker/cosmos';
import { uuid } from '@cfworker/uuid';
import { Activity } from '../../models';
import { DbService } from '../database-services';
import { DataServiceHelper } from './helper.data-service';

declare type ActivityDbObject = Activity & Document & Resource;

export class ActivityDataService {
  constructor(private readonly db: DbService) {}

  async getAllAsync(topLevelId: string): Promise<Activity[]> {
    const dbModels = await this.db.getAllByPartitionAsync<ActivityDbObject>(topLevelId, false);
    const models: Activity[] = [];

    if (dbModels) for (const dbModel of dbModels) models.push(this.fromDb(dbModel));

    return models;
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return this.fromDb(await this.db.upsertDocument<ActivityDbObject>(this.toDb(activity), activity.topLevelId));
  }

  private toDb(model: Activity): Partial<ActivityDbObject> {
    return {
      action: model.action,
      data: model.data,
      id: uuid(),
      _ts: 0,
      objectId: model.objectId,
      topLevelId: model.topLevelId,
      userId: model.userId,
      versionId: model.versionId,
      label: model.label,
      labelTitle: model.labelTitle,
    };
  }

  private fromDb(modelDb: ActivityDbObject): Activity {
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
