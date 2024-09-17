import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { Organization } from '../../models';
import { Helper } from './_helper.service';

export class OrganizationsRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async getAll() {
    try {
      return await this.helper.data.organizations.getAllAsync();
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get all organizations.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async getByName(name: string) {
    try {
      return await this.helper.data.organizations.getByNameAsync(name);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get organization by name.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async update(user: Organization) {
    try {
      await this.helper.data.organizations.updateAsync(user);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to update organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }
}
