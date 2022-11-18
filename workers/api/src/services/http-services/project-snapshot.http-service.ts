import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ProjectSnapshotHttpService extends BaseHttpService {
  static async getByActivityIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.projectId || !req.params?.activityId) return 500;

      const data = await req.services.data.projectSnapshots.getAsync(req.params.projectId, req.params.activityId);

      return await super.buildJson(data);
    } catch (e) {
      req.logException('An error occured trying to get a project snapshot.', 'ProjectSnapshotHttpService.getByActivityIdAsync', <Error>e);
      return 500;
    }
  }
}
