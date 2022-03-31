import { METADATA_TYPES } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ResourcesHttpService extends BaseHttpService {
  static async getAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.config.debug) {
        const match = await req.edge.cacheMatch();

        if (match) return match;
      }
      if (!req.params?.category) return 500;
      //
      //  Get the data from the KV
      //
      const data = await req.data.metadata.getAsync(
        METADATA_TYPES.RESOURCES,
        `${req.user?.userInfo?.culture}.${req.params.category}`,
      );
      const response = await super.buildJson(data);

      if (data && !req.config.debug) req.edge.cachePut(response);

      return response;
    } catch (e) {
      req.logException(
        'An error occured trying to get resources.',
        'ResourcesHttpService.getAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
