import { Context } from '../../config';
import { Project, ProjectCreatedQueueMessage } from '../../models';
import { HttpOriginService } from '../origin-services/http-origin.service';
import { Transformers } from '../transformers';

export class ProjectHttpService {
  static async getIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const obj = await ctx.var.data.projects.getByIdAsync(owner, project);

      return obj ? ctx.json(obj.id) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get a project ID from record locator.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getRecordIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const obj = await ctx.var.data.projects.getByIdAsync(owner, project);

      return obj ? ctx.json(obj.recordId) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get a project record ID.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByOwnerAsync(ctx: Context): Promise<Response> {
    try {
      const { owner } = ctx.req.param();

      return ctx.json(await ctx.var.data.projects.getByOwnerAsync(owner));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get projects.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const [projectObj, tasks, approvals] = await Promise.all([
        ctx.var.data.projects.getByIdAsync(owner, project),
        ctx.var.data.projectNodes.getAsync(owner, project),
        ctx.var.data.projectApprovals.getAsync(owner, project),
      ]);

      if (!projectObj) return ctx.text('Not Found', 404);

      const userId = ctx.var.userId;
      const claims = await ctx.var.claims.getForProjectAsync(projectObj, userId);
      //
      //  Now get users
      //
      const userIds = [...new Set((projectObj.roles ?? []).map((r) => r.userId))];
      const users = await ctx.var.data.users.getViewsAsync(owner, userIds, 'organization');

      return ctx.json({
        project: Transformers.project.toViewModel(projectObj, users),
        tasks,
        approvals,
        claims,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get project by id.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getNodesAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();

      return ctx.json(await ctx.var.data.projectNodes.getAsync(owner, project));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get project nodes.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putProjectAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        exec.waitUntil(ctx.var.data.projects.refreshKvAsync(owner, project));
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save a project.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async createProjectAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const body: { project: Project; tasks: any[] } = await ctx.req.json();
      //
      //  SaveProject
      //
      const projectResponse = await ctx.var.origin.putAsync(body.project, `portfolio/${owner}/projects/${project}`);

      if (projectResponse.status >= 300) {
        return ctx.newResponse(projectResponse.body, projectResponse.status);
      }
      //
      //  Save Tasks
      //
      const tasksResponse = await ctx.var.origin.putAsync({ upserts: body.tasks }, `portfolio/${owner}/projects/${project}/nodes`);

      if (tasksResponse.status >= 300) {
        return ctx.newResponse(tasksResponse.body, tasksResponse.status);
      }
      //
      //  Now refresh KVs
      //
      const exec = ctx.executionCtx;

      exec.waitUntil(ctx.var.data.projects.refreshKvAsync(owner, project));
      //
      //  Now send email to the contributors
      //
      await ctx.env.PROJECT_CREATED_QUEUE.send({
        project: body.project,
        createdBy: ctx.var.userId,
      });

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save a project.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteProjectAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        exec.waitUntil(ctx.var.data.projects.clearKvAsync(owner, project));
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to delete a project.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putNodesAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        exec.waitUntil(ctx.var.data.projects.refreshKvAsync(owner, project));
        exec.waitUntil(ctx.var.data.projectNodes.refreshKvAsync(owner, project));
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save a project or project node.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
