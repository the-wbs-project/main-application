import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { Helper } from './_helper.service';

export class RolesRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async getAll() {
    try {
      return await this.helper.data.roles.getAllAsync();
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get all roles.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }
}
