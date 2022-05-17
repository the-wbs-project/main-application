import { Activity, IdObject } from '../../models';
import { DbFactory, DbService } from '../database-services';

declare type ActivityDbObject = Activity & IdObject;

export class ActivityDataService {
  private readonly db: DbService;

  constructor(private readonly organization: string, dbFactory: DbFactory) {
    this.db = dbFactory.createDbService(
      this.organization,
      'Activities',
      'topLevelId',
    );
  }

  async getAllAsync(topLevelId: string): Promise<Activity[]> {
    const dbModels = await this.db.getAllByPartitionAsync<ActivityDbObject>(
      topLevelId,
      false,
    );
    const models: Activity[] = [];

    for (const dbModel of dbModels) models.push(this.fromDb(dbModel));

    return models;
  }

  putAsync(activity: Activity): Promise<number> {
    return this.db.upsertDocument(this.toDb(activity), activity.topLevelId);
  }

  private toDb(model: Activity): ActivityDbObject {
    return {
      action: model.action,
      data: model.data,
      id: model.timestamp.toString(),
      objectId: model.objectId,
      topLevelId: model.topLevelId,
      userId: model.topLevelId,
      versionId: model.versionId,
      timestamp: model.timestamp,
      label: model.label,
      labelTitle: model.labelTitle,
    };
  }

  private fromDb(modelDb: ActivityDbObject): Activity {
    return {
      action: modelDb.action,
      data: modelDb.data,
      timestamp: parseInt(modelDb.id),
      objectId: modelDb.objectId,
      topLevelId: modelDb.topLevelId,
      userId: modelDb.topLevelId,
      versionId: modelDb.versionId,
      label: modelDb.label,
      labelTitle: modelDb.labelTitle,
    };
  }
}
