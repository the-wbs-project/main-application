import { Discussion, User } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

const GLOBAL = 'global';

export class DiscussionHttpService extends BaseHttpService {
  static async getAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.associationId) return 500;

      const service =
        req.params.organization === GLOBAL ? req.context.services.data.discussionsGlobal : req.context.services.data.discussionsCorporate;

      const discussions = await service.getAllAsync(req.params.associationId, req.params.threadId);

      return await super.buildJson(discussions);
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all discussions based on an association.',
        'DiscussionHttpService.getAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async getUsersAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.associationId) return 500;

      const service =
        req.params.organization === GLOBAL ? req.context.services.data.discussionsGlobal : req.context.services.data.discussionsCorporate;

      const userIds = await service.getAllUsersAsync(req.params.associationId);
      const userGets: Promise<User>[] = [];

      for (const id of userIds) {
        userGets.push(req.context.services.identity.getUserAsync(req, id));
      }
      return await super.buildJson(
        (
          await Promise.all(userGets)
        ).map((user) => {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }),
      );
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all users who has responded to an association.',
        'DiscussionHttpService.getUsersAsync',
        <Error>e,
      );
      return 500;
    }
  }
  static async getTextAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.associationId) return 500;

      const service =
        req.params.organization === GLOBAL ? req.context.services.data.discussionsGlobal : req.context.services.data.discussionsCorporate;

      const thread = await service.getAsync(req.params.associationId, req.params.threadId);

      return thread
        ? new Response(`<html><body class="body">${thread.text}</body></html>`, {
            headers: {
              'content-type': 'text/html',
            },
          })
        : 404;
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

      const service =
        req.params.organization === GLOBAL ? req.context.services.data.discussionsGlobal : req.context.services.data.discussionsCorporate;
      const model: Discussion = await req.request.json();

      await service.putAsync(model);

      if (model.threadId) {
        const thread = await service.getAsync(model.associationId, model.threadId);

        if (thread) {
          thread.lastUpdated = model.createdOn;

          await service.putAsync(thread);
        }
      }

      return 204;
    } catch (e) {
      req.context.logException('An error occured trying to save a discussion.', 'DiscussionHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
