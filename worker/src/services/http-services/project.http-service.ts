import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ProjectHttpService extends BaseHttpService {
  static async getAllAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await super.buildJson(await req.context.services.data.projects.getAllAsync());
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all projects for the organization.',
        'ProjectHttpService.getAllAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async getAllWatchedAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.context.state?.userId) return 500;

      const data = await req.context.services.data.projects.getAllWatchedAsync(req.context.state.userId);
      return await super.buildJson(data);
    } catch (e) {
      req.context.logException('An error occured trying to get all watched projects.', 'ProjectHttpService.getAllWatchedAsync', <Error>e);
      return 500;
    }
  }

  static async getByIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.context.config.debug) {
        const match = await req.context.services.edge.cacheMatch();

        if (match) return match;
      }
      if (!req.params?.projectId) return 500;

      const data = await req.context.services.data.projects.getAsync(req.params.projectId);

      return await super.buildJson(data);
    } catch (e) {
      req.context.logException("An error occured trying to get a project by it's ID.", 'ProjectHttpService.getByIdAsync', <Error>e);
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const params = req.params;
      const projectId = params?.projectId;

      if (!projectId) return 500;

      await req.context.services.data.projects.putAsync(await req.request.json());

      return 204;
    } catch (e) {
      req.context.logException('An error occured trying to update a project.', 'ProjectHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
