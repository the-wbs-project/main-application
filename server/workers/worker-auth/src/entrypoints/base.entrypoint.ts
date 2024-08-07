import { WorkerEntrypoint } from 'cloudflare:workers';
import { Env } from '../config';
import { Auth0Service, DataDogService, DataServiceFactory, Fetcher, JobLogger } from '../services';

export abstract class BaseEntrypoint extends WorkerEntrypoint<Env> {
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
