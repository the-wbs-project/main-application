import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { QueueService } from '../queue.service';
import { Helper } from './_helper.service';

export class UtilsRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async refreshAll() {
    try {
      await new QueueService(this.helper.data, this.env).refreshAllAsync();
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to refresh all queues.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }
}
