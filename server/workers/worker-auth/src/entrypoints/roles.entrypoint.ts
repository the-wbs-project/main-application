import { BaseEntrypoint } from './base.entrypoint';

export class RolesEntrypoint extends BaseEntrypoint {
  async getAll() {
    try {
      return await this.data.roles.getAllAsync();
    } catch (e) {
      this.logger.trackException('An error occured trying to get all roles.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}
