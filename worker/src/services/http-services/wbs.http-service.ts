import { Config } from '../../config';
import {
  Category,
  METADATA_TYPES,
  PROJECT_VIEW,
  Resources,
} from '../../models';
import { ResourceService } from '../helpers';
import { WbsNodePhaseTransformer } from '../transformers';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class WbsHttpService extends BaseHttpService {
  constructor(private readonly config: Config) {
    super();
  }

  async getPhaseListAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const d = req.data;
      const params = req.params;

      if (
        !params?.ownerId ||
        !params?.projectId ||
        !req.user?.userInfo?.culture
      )
        return 500;

      console.log(req.user?.userInfo?.culture);
      //
      //  Get the necessary data, it's a bit
      //
      const [project, phases, disciplines, resources] = await Promise.all([
        d.projects.getAsync(params.ownerId, params.projectId, false),
        d.metadata.getAsync<Category[]>(
          METADATA_TYPES.CATEGORIES,
          PROJECT_VIEW.PHASE,
        ),
        d.metadata.getAsync<Category[]>(
          METADATA_TYPES.CATEGORIES,
          PROJECT_VIEW.DISCIPLINE,
        ),
        d.metadata.getAsync<Resources>(
          METADATA_TYPES.RESOURCES,
          req.user.userInfo.culture,
        ),
      ]);
      if (!project) return 404;
      if (!resources || !phases || !disciplines) return 500;

      const resourceService = new ResourceService(resources);
      const transformer = new WbsNodePhaseTransformer(
        phases,
        disciplines,
        resourceService,
      );

      const list = transformer.run(project);
      const response = await super.buildJson(list);

      return response;
    } catch (e) {
      req.logException(
        'An error occured trying to get the phase WBS list for a project.',
        'WbsHttpService.getPhaseListAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
