import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

const GLOBAL = 'global';

export class DiscussionHttpService extends BaseHttpService {
  static async getAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.associationId) return 500;

      const service = req.params.organization === GLOBAL ? req.services.data.discussionsGlobal : req.services.data.discussionsCorporate;

      return await super.buildJson(await service.getAllAsync(req.params.associationId, req.params.threadId));
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all discussions based on an association.',
        'DiscussionHttpService.getAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.threadId) return 500;

      const service = req.params.organization === GLOBAL ? req.services.data.discussionsGlobal : req.services.data.discussionsCorporate;

      await service.putAsync(await req.request.json());

      return 204;
    } catch (e) {
      req.context.logException('An error occured trying to save a discussion.', 'DiscussionHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
