import { Activity } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ActivityHttpService extends BaseHttpService {
  static async getByIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.topLevelId) return 500;

      const data = await req.context.services.data.activities.getAllAsync(req.params.topLevelId);

      return await super.buildJson(data);
    } catch (e) {
      req.context.logException('An error occured trying to get all activity for an object.', 'ActivityHttpService.getByIdAsync', <Error>e);
      return 500;
    }
  }

  static async getByUserIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.userId) return 500;

      const data = await req.context.services.data.userActivities.getAllAsync(req.params.userId);

      return await super.buildJson(data);
    } catch (e) {
      req.context.logException('An error occured trying to get all activity for a user.', 'ActivityHttpService.getByUserIdAsync', <Error>e);
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.context.state?.userId) return 500;

      const activity: Activity = await req.request.json();
      const dataType = req.params?.dataType!;

      activity.userId = req.context.state.userId;

      await req.context.services.data.activities.putAsync(activity);

      if (dataType === 'project') await req.context.services.data.projectSnapshots.putAsync(activity.topLevelId, activity.id);

      await req.context.services.data.userActivities.putAsync(activity);

      return 204;
    } catch (e) {
      req.context.logException('An error occured trying to insert an activity.', 'ActivityHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
