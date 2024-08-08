import { Env } from '../../config';
import { Auth0Service } from '../api-services';
import { DataServiceFactory } from '../data-services';
import { Fetcher } from '../fetcher.service';
import { DataDogService, JobLogger } from '../logging';

export class Helper {
  readonly auth0: Auth0Service;
  readonly data: DataServiceFactory;
  readonly datadog: DataDogService;
  readonly fetcher: Fetcher;
  readonly logger: JobLogger;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    this.datadog = new DataDogService(this.env);
    this.logger = new JobLogger(this.env, this.datadog, 'service');
    this.fetcher = new Fetcher(this.logger);
    this.auth0 = new Auth0Service(this.env, this.fetcher, this.logger);
    this.data = new DataServiceFactory(this.auth0, this.logger, this.env.KV_DATA, this.ctx);
  }

  async getOrgId(name: string): Promise<string> {
    const id = await this.data.organizations.getIdFromNameAsync(name);

    if (!id) throw new Error(`Organization ${name} not found`);

    return id;
  }
}
