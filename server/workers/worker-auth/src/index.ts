import { WorkerEntrypoint } from 'cloudflare:workers';
import { Env } from './config';
import { InviteBody, Organization, User } from './models';
import { Auth0Service, DataDogService, DataServiceFactory, Fetcher, JobLogger, QueueService } from './services';

abstract class BaseEntrypoint extends WorkerEntrypoint<Env> {
  protected readonly datadog = new DataDogService(this.env);
  protected readonly logger = new JobLogger(this.env, this.datadog, 'service');
  protected readonly fetcher = new Fetcher(this.logger);
  protected readonly auth0 = new Auth0Service(this.env, this.fetcher, this.logger);
  protected readonly data = new DataServiceFactory(this.auth0, this.logger, this.env.KV_DATA, this.ctx);

  protected async getOrgId(name: string): Promise<string> {
    const id = await this.data.organizations.getIdFromNameAsync(name);

    if (!id) throw new Error(`Organization ${name} not found`);

    return id;
  }
}

export class InviteEntrypoint extends BaseEntrypoint {
  async getAll(organizationName: string) {
    try {
      return await this.data.invites.getAllAsync(await this.getOrgId(organizationName));
    } catch (e) {
      this.logger.trackException('An error occured trying to get all invites for an organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async send(organizationName: string, inviteBody: InviteBody) {
    try {
      return await this.data.invites.sendAsync(await this.getOrgId(organizationName), inviteBody);
    } catch (e) {
      this.logger.trackException('An error occured trying to send an invite.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async delete(organizationName: string, inviteId: string) {
    try {
      return await this.data.invites.deleteAsync(await this.getOrgId(organizationName), inviteId);
    } catch (e) {
      this.logger.trackException('An error occured trying to delete memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}

export class MembershipsEntrypoint extends BaseEntrypoint {
  async getAll(organizationName: string) {
    try {
      return await this.data.memberships.getAllAsync(await this.getId(organizationName));
    } catch (e) {
      this.logger.trackException('An error occured trying to get all memberships for an organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async get(organizationName: string, userId: string) {
    try {
      return await this.data.memberships.getAsync(await this.getId(organizationName), userId);
    } catch (e) {
      this.logger.trackException('An error occured trying to get membership by org and user.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async add(organizationName: string, members: string[]) {
    try {
      return await this.data.memberships.addAsync(await this.getId(organizationName), members);
    } catch (e) {
      this.logger.trackException('An error occured trying to add memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async delete(organizationName: string, members: string[]) {
    try {
      return await this.data.memberships.deleteAsync(await this.getId(organizationName), members);
    } catch (e) {
      this.logger.trackException('An error occured trying to delete memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async addToRoles(organizationName: string, userId: string, roles: string[]) {
    try {
      return await this.data.memberships.addToRolesAsync(await this.getId(organizationName), userId, roles);
    } catch (e) {
      this.logger.trackException("An error occured trying to add roles from a user's membership", <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async deleteFromRoles(organizationName: string, userId: string, roles: string[]) {
    try {
      return await this.data.memberships.deleteFromRolesAsync(await this.getId(organizationName), userId, roles);
    } catch (e) {
      this.logger.trackException("An error occured trying to delete roles from a user's membership", <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  private async getId(name: string): Promise<string> {
    const id = await this.data.organizations.getIdFromNameAsync(name);

    if (!id) throw new Error(`Organization ${name} not found`);

    return id;
  }
}

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

export default {};
