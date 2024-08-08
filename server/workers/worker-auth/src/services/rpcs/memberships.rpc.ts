import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { Helper } from './_helper.service';

export class MembershipsRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async getAll(organizationName: string) {
    try {
      return await this.helper.data.memberships.getAllAsync(await this.getId(organizationName));
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get all memberships for an organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async get(organizationName: string, userId: string) {
    try {
      return await this.helper.data.memberships.getAsync(await this.getId(organizationName), userId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get membership by org and user.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async add(organizationName: string, members: string[]) {
    try {
      return await this.helper.data.memberships.addAsync(await this.getId(organizationName), members);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to add memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async delete(organizationName: string, members: string[]) {
    try {
      return await this.helper.data.memberships.deleteAsync(await this.getId(organizationName), members);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to delete memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async addToRoles(organizationName: string, userId: string, roles: string[]) {
    try {
      return await this.helper.data.memberships.addToRolesAsync(await this.getId(organizationName), userId, roles);
    } catch (e) {
      this.helper.logger.trackException("An error occured trying to add roles from a user's membership", <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async deleteFromRoles(organizationName: string, userId: string, roles: string[]) {
    try {
      return await this.helper.data.memberships.deleteFromRolesAsync(await this.getId(organizationName), userId, roles);
    } catch (e) {
      this.helper.logger.trackException("An error occured trying to delete roles from a user's membership", <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  private async getId(name: string): Promise<string> {
    const id = await this.helper.data.organizations.getIdFromNameAsync(name);

    if (!id) throw new Error(`Organization ${name} not found`);

    return id;
  }
}
