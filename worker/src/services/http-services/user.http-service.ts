import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class UserHttpService extends BaseHttpService {
  static async getAllAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await super.buildJson(
        await req.services.identity.getUsersAsync(req),
      );
    } catch (e) {
      req.logException(
        'An error occured trying to get all users for the organization.',
        'UserHttpService.getAllAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
