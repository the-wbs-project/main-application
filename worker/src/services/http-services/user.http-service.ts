import { User } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class UserHttpService extends BaseHttpService {
  static async getAllAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await super.buildJson(await req.context.services.identity.getUsersAsync(req));
    } catch (e) {
      req.context.logException('An error occured trying to get all users for the organization.', 'UserHttpService.getAllAsync', <Error>e);
      return 500;
    }
  }

  static async getAllLiteAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await super.buildJson(await req.context.services.identity.getLiteUsersAsync(req));
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all lite verions of users for the organization.',
        'UserHttpService.getAllLiteAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async updateProfileAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const user: User = await req.request.json();

      await req.context.services.identity.updateProfileAsync(req, user);

      return 204;
    } catch (e) {
      req.context.logException(
        "An error occured trying to update the logged in user's profile.",
        'UserHttpService.updateProfileAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async updateUserAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const user: User = await req.request.json();

      await req.context.services.identity.updateUserAsync(req, user);

      return 204;
    } catch (e) {
      req.context.logException('An error occured trying to update the user.', 'UserHttpService.updateUserAsync', <Error>e);
      return 500;
    }
  }
}
