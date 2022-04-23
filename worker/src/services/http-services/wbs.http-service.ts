import { ACTIVITIES, Activity, PROJECT_VIEW } from '../../models';
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
      console.log('hi again');
      const d = req.data;
      const params = req.params;

      if (
        !params?.ownerId ||
        !params?.projectId ||
        !params?.view ||
        !req.user?.userInfo?.culture
      )
        return 500;
      //
      //  Get the necessary data, it's a bit
      //
      const [project, phases, disciplines, resources] = await Promise.all([
        d.projects.getAsync(params.ownerId, params.projectId, false),
        d.metadata.getCategoryAsync(PROJECT_VIEW.PHASE),
        d.metadata.getCategoryAsync(PROJECT_VIEW.DISCIPLINE),
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
      console.log('hi');
      req.logException(
        'An error occured trying to get the phase WBS list for a project.',
        'WbsHttpService.getListAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async markNodeAsRemovedAsync(
    req: WorkerRequest,
  ): Promise<Response | number> {
    try {
      const d = req.data;
      const params = req.params;
      const ownerId = params?.ownerId;
      const projectId = params?.projectId;
      const nodeId = params?.nodeId;
      const userId = req.user?.id;

      if (!ownerId || !projectId || !nodeId || !userId) return 500;
      //
      //  get project
      //
      const reason = await req.request.text();
      const project = await d.projects.getAsync(ownerId, projectId, false);

      if (!project) return 404;

      const node = project.nodes?.find((x) => x.id === nodeId);

      if (!node) return 404;

      node.removed = true;

      if (project.activity == null) project.activity = [];

      const activity: Activity = {
        action: ACTIVITIES.NODE_DELETED,
        userId: userId,
        orgId: project.owner,
        timestamp: new Date(),
        wbsParentId: project.id,
        wbsId: node.id,
        data: {
          reason,
        },
      };
      project.activity.push(activity);

      await d.projects.putAsync(project);

      return super.buildJson(activity);
    } catch (e) {
      req.logException(
        'An error occured trying to mark a node as removed.',
        'WbsHttpService.markNodeAsDeletedAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
