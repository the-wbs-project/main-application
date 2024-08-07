import { User } from '../models';
import { BaseEntrypoint } from './base.entrypoint';

export class UserEntrypoint extends BaseEntrypoint {
  async getBasic(userId: string) {
    try {
      return await this.data.users.getBasicAsync(userId);
    } catch (e) {
      this.logger.trackException('An error occured trying to get basic user information.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async getView(organizationName: string, userId: string, visibility: string) {
    try {
      const organizationId = await this.data.organizations.getIdFromNameAsync(organizationName);

      if (!organizationId) throw new Error('Organization not found');

      return await this.data.users.getAsync(organizationId, userId, visibility);
    } catch (e) {
      this.logger.trackException('An error occured trying to get user view model.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async getProfile(userId: string) {
    try {
      return await this.data.users.getProfileAsync(userId);
    } catch (e) {
      this.logger.trackException('An error occured trying to user profile.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async getSiteRoles(userId: string) {
    try {
      return await this.data.users.getSiteRolesAsync(userId);
    } catch (e) {
      this.logger.trackException('An error occured trying to user site roles.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async getMemberships(userId: string) {
    try {
      return await this.data.users.getMembershipsAsync(userId);
    } catch (e) {
      this.logger.trackException('An error occured trying to user memberships.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async update(user: User) {
    try {
      return await this.data.users.updateAsync(user);
    } catch (e) {
      this.logger.trackException('An error occured trying to update user profile.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}
