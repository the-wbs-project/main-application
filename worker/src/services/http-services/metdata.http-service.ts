import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class MetadataHttpService extends BaseHttpService {
  static setInfo(req: WorkerRequest): void {
    if (!req.params) req.params = {};

    req.params.category = 'Info';
  }

  static async getResourcesAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.config.debug) {
        const match = await req.services.edge.cacheMatch();

        if (match) return match;
      }
      const culture = req.state?.culture ?? 'en-US';

      if (!req.params?.category) return 500;
      //
      //  Get the data from the KV
      //
      const data = await req.services.data.metadata.getResourcesAsync(culture, req.params.category);
      const response = await super.buildJson(data);

      if (data && !req.config.debug) req.services.edge.cachePut(response);

      return response;
    } catch (e) {
      req.logException('An error occured trying to get resources.', 'MetadataHttpService.getResourcesAsync', <Error>e);
      return 500;
    }
  }

  static async getListAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.config.debug) {
        const match = await req.services.edge.cacheMatch();

        if (match) return match;
      }
      if (!req.params?.name) return 500;
      //
      //  Get the data from the KV
      //
      const data = await req.services.data.metadata.getListAsync(req.params.name);
      const response = await super.buildJson(data);

      if (data && !req.config.debug) req.services.edge.cachePut(response);

      return response;
    } catch (e) {
      req.logException('An error occured trying to get a list.', 'MetadataHttpService.getListAsync', <Error>e);
      return 500;
    }
  }
}
