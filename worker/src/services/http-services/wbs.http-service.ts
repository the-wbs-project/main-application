import { Config } from '../../config';
import { PROJECT_VIEW } from '../../models';
import { ResourceService } from '../helpers';
import {
  WbsDisciplineNodeTransformer,
  WbsNodePhaseTransformer,
} from '../transformers';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class WbsHttpService extends BaseHttpService {
  static async getListAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const d = req.data;
      const params = req.params;

      if (
        !params?.ownerId ||
        !params?.projectId ||
        !params?.view ||
        !req.user?.userInfo?.culture
      )
        return 500;

      console.log(req.user?.userInfo?.culture);
      //
      //  Get the necessary data, it's a bit
      //
      const [project, phases, disciplines, resources] = await Promise.all([
        d.projects.getAsync(params.ownerId, params.projectId, false),
        d.metadata.getCategoriesAsync(PROJECT_VIEW.PHASE),
        d.metadata.getCategoriesAsync(PROJECT_VIEW.DISCIPLINE),
        d.metadata.getResourcesAsync(req.user.userInfo.culture, 'General'),
      ]);
      if (!project) return 404;
      if (!resources || !phases || !disciplines) return 500;

      const resourceService = new ResourceService(resources);

      if (params.view === PROJECT_VIEW.PHASE) {
        const transformer = new WbsNodePhaseTransformer(
          phases,
          disciplines,
          resourceService,
        );

        return super.buildJson(transformer.run(project));
      }

      const transformer = new WbsDisciplineNodeTransformer(
        phases,
        disciplines,
        resourceService,
      );

      return super.buildJson(transformer.run(project));
    } catch (e) {
      req.logException(
        'An error occured trying to get the phase WBS list for a project.',
        'WbsHttpService.getListAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
