import { Config } from '../../config';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ProjectHttpService extends BaseHttpService {
  constructor(private readonly config: Config) {
    super();
  }

  async getByIdAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!this.config.debug) {
        const match = await req.edge.cacheMatch();

        if (match) return match;
      }
      if (!req.params?.ownerId || !req.params?.projectId) return 500;
      //
      //  Get the data from the KV
      //
      const data = await req.data.projects.getAsync(
        req.params.ownerId,
        req.params.projectId,
      );
      const response = await super.buildJson(data);

      if (data) req.edge.cachePut(response);

      return response;
    } catch (e) {
      req.logException(
        "An error occured trying to get a project by it's ID.",
        'ProjectHttpService.getByIdAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
