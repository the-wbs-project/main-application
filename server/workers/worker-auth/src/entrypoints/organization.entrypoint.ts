import { Organization } from '../models';
import { BaseEntrypoint } from './base.entrypoint';

export class OrganizationEntrypoint extends BaseEntrypoint {
  async getAll() {
    try {
      return await this.data.organizations.getAllAsync();
    } catch (e) {
      this.logger.trackException('An error occured trying to get all organizations.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async getByName(name: string) {
    try {
      return await this.data.organizations.getByNameAsync(name);
    } catch (e) {
      this.logger.trackException('An error occured trying to get organization by name.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async update(user: Organization) {
    try {
      await this.data.organizations.updateAsync(user);
    } catch (e) {
      this.logger.trackException('An error occured trying to update organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}
