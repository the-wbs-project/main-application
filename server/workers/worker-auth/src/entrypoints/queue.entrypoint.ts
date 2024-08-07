import { QueueService } from '../services';
import { BaseEntrypoint } from './base.entrypoint';

export class QueueEntrypoint extends BaseEntrypoint {
  async refreshAll() {
    try {
      await new QueueService(this.data, this.env).refreshAllAsync();
    } catch (e) {
      this.logger.trackException('An error occured trying to refresh all queues.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}
