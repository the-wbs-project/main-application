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

  static async getByUserIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.userId) return 500;

      const data = await req.services.data.userActivities.getAllAsync(req.params.userId);

      return await super.buildJson(data);
    } catch (e) {
      req.logException('An error occured trying to get all activity for a user.', 'ActivityHttpService.getByUserIdAsync', <Error>e);
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.state?.userId) return 500;

      let activity: Activity = await req.request.json();
      const dataType = req.params?.dataType!;

      activity.userId = req.state.userId;
      activity = await req.services.data.activities.putAsync(activity);

      if (dataType === 'project') await req.services.data.projectSnapshots.putAsync(activity.topLevelId, activity.id);

      await req.services.data.userActivities.putAsync(activity);

      return super.buildJson(activity);
    } catch (e) {
      req.logException('An error occured trying to insert an activity.', 'ActivityHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
