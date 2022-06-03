import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class ProjectNodeHttpService extends BaseHttpService {
  static async getAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.projectId) return 500;
      //
      //  Get the data from the KV
      //
      const data = await req.services.data.projectNodes.getAllAsync(
        req.params.projectId,
      );
      return await super.buildJson(data);
    } catch (e) {
      req.logException(
        'An error occured trying to get the phase WBS list for a project.',
        'ProjectNodeHttpService.getAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const params = req.params;
      const projectId = params?.projectId;
      const nodeId = params?.nodeId;

      if (!projectId || !nodeId) return 500;

      await req.services.data.projectNodes.putAsync(await req.request.json());

      return 204;
      /*
      //
      //  get project
      //
      const reason = await req.request.text();
      const project = await d.projects.getAsync(projectId, false);

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

      return super.buildJson(activity);*/
    } catch (e) {
      req.logException(
        'An error occured trying to put a node.',
        'ProjectNodeHttpService.putAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async batchAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const params = req.params;
      const projectId = params?.projectId;

      if (!projectId) return 500;

      const data = await req.request.json();

      await req.services.data.projectNodes.batchAsync(
        projectId,
        data.upserts,
        data.removeIds,
      );

      return 204;
    } catch (e) {
      req.logException(
        'An error occured trying upload a batch of node changes.',
        'ProjectNodeHttpService.batchAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
