import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { User } from '../../models';
import { Helper } from './_helper.service';

export class UsersRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async getBasic(userId: string) {
    try {
      return await this.helper.data.users.getBasicAsync(userId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get basic user information.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async getView(organizationName: string, userId: string, visibility: 'organization' | 'public') {
    try {
      const organizationId = await this.helper.data.organizations.getIdFromNameAsync(organizationName);

      if (!organizationId) throw new Error('Organization not found');

      return await this.helper.data.users.getAsync(organizationId, userId, visibility);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get user view model.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async getProfile(userId: string) {
    try {
      return await this.helper.data.users.getProfileAsync(userId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to user profile.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async getSiteRoles(userId: string) {
    try {
      return await this.helper.data.users.getSiteRolesAsync(userId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to user site roles.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async getMemberships(userId: string) {
    try {
      return await this.helper.data.users.getMembershipsAsync(userId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to user memberships.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async update(user: User) {
    try {
      return await this.helper.data.users.updateAsync(user);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to update user profile.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }
}
