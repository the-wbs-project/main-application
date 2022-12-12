import { Document } from '@cfworker/cosmos';
import { uuid } from '@cfworker/uuid';
import { Activity } from '../../models';
import { DbService } from '../database-services';
import { DataServiceHelper } from './helper.data-service';

declare type ActivityDbObject = Activity & Document;

export class ActivityDataService {
  constructor(private readonly db: DbService) {}

  async fixAsync(): Promise<void> {
    const models = await this.db.getAllAsync<ActivityDbObject>(false);
    let fixes: Promise<any>[] = [];

    if (models)
      for (const dbModel of models) {
        if (dbModel.timestamp !== DataServiceHelper.fixTsValue(dbModel._ts)) {
          dbModel.timestamp = DataServiceHelper.fixTsValue(dbModel._ts);

          console.log(new Date(dbModel.timestamp));
          fixes.push(this.putAsync(dbModel));

          if (fixes.length === 15) {
            await Promise.all(fixes);
            fixes = [];
          }
        }
      }
    if (fixes.length > 0) {
      await Promise.all(fixes);
    }
  }

  async getAllAsync(topLevelId: string): Promise<Activity[]> {
    const models = await this.db.getAllByPartitionAsync<ActivityDbObject>(topLevelId, false);

    if (models)
      for (const dbModel of models) {
        if (dbModel.timestamp == undefined) {
          dbModel.timestamp = dbModel._ts;

          await this.putAsync(dbModel);
        }
      }

    return models;
  }

  async putAsync(activity: Activity): Promise<Activity> {
    return await this.db.upsertDocument<ActivityDbObject>(this.toDb(activity), activity.topLevelId);
  }

  private toDb(model: Activity): Partial<ActivityDbObject> {
    return {
      action: model.action,
      data: model.data,
      id: uuid(),
      timestamp: new Date().getTime(),
      objectId: model.objectId,
      topLevelId: model.topLevelId,
      userId: model.userId,
      versionId: model.versionId,
      label: model.label,
      labelTitle: model.labelTitle,
    };
  }
}
