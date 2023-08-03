import { Context } from '../../config';
import { Discussion, User } from '../../models';
import { IdentityService } from '../auth-services';

const GLOBAL = 'global';

export class DiscussionHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, associationId, id } = ctx.req.param();

      if (!organization || !associationId) return ctx.text('Missing Parameters', 500);

      const service = ctx.get('data').discussions;

      return ctx.json(await service.getAllAsync(associationId, id));
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get all discussions based on an association.',
          'DiscussionHttpService.getAsync',
          <Error>e,
        );
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getUsersAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, associationId } = ctx.req.param();

      if (!organization || !associationId) return ctx.text('Missing Parameters', 500);

      const service = ctx.get('data').discussions;

      const userIds = await service.getAllUsersAsync(associationId);
      const userGets: Promise<User>[] = [];

      for (const id of userIds) {
        //userGets.push(IdentityService.getUserAsync(ctx, id));
      }
      return ctx.json(
        (await Promise.all(userGets)).map((user) => {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }),
      );
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get all users who has responded to an association.',
          'DiscussionHttpService.getUsersAsync',
          <Error>e,
        );
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getTextAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, associationId, id } = ctx.req.param();

      if (!organization || !associationId) return ctx.text('Missing Parameters', 500);

      const service = ctx.get('data').discussions;
      const thread = await service.getAsync(associationId, id);

      return thread ? ctx.html(`<html><body class="body">${thread.text}</body></html>`) : ctx.text('', 404);
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get all discussions based on an association.',
          'DiscussionHttpService.getAsync',
          <Error>e,
        );
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, associationId } = ctx.req.param();

      if (!organization || !associationId) return ctx.text('Missing Parameters', 500);

      const service = ctx.get('data').discussions;
      const model: Discussion = await ctx.req.json();

      await service.putAsync(model);

      if (model.id) {
        const thread = await service.getAsync(model.associationId, model.id);

        if (thread) {
          thread.lastUpdated = model.createdOn;

          await service.putAsync(thread);
        }
      }

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a discussion.', 'DiscussionHttpService.putAsync', <Error>e);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
