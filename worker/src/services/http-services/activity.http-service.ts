import { Activity } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ActivityHttpService extends BaseHttpService {
  static async getByIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.topLevelId) return 500;

      const data = await req.services.data.activities.getAllAsync(req.params.topLevelId);

      return await super.buildJson(data);
    } catch (e) {
      req.logException('An error occured trying to get all activity for an object.', 'ActivityHttpService.getByIdAsync', <Error>e);
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.state?.userId) return 500;

      const activity: Activity = await req.request.json();
      const dataType = req.params?.dataType!;

      activity.userId = req.state.userId;

      const dbModel = req.services.data.activities.toDb(activity);

      if (dataType === 'project') await req.services.data.projectSnapshots.putAsync(dbModel.topLevelId, dbModel.id);

      return await req.services.data.activities.putAsync(dbModel);
    } catch (e) {
      req.logException('An error occured trying to insert an activity.', 'ActivityHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
