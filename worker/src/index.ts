import { Env, EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { DataServiceFactory } from './services/data-services';
import { CosmosFactory } from './services/database-services/cosmos';
import { CloudflareService } from './services/edge-services/cloudflare';
import { ServiceFactory } from './services/factory.service';
import { Logger } from './services/logger.service';
import { CloudflareStorageFactory } from './services/storage-services/cloudflare/cloudflare-storage-factory.service';

export default {
  async fetch(request: Request, environment: any, context: ExecutionContext): Promise<Response> {
    try {
      const config = new EnvironmentConfig(environment);
      const logger = new Logger(config.appInsightsKey, request);
      const db = new CosmosFactory(config, logger);
      const edge = new CloudflareService(config, request, context);
      const storage = new CloudflareStorageFactory(config);
      const data = new DataServiceFactory(db, edge, request, storage);
      const services = new ServiceFactory(config, data, edge);
      const workerRequest = new WorkerRequest(request, config, services, logger);

      return await services.router.matchAsync(workerRequest);
    } catch (err) {
      console.error(err);
      return new Response((<Error>err).message, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
  },
  /*async scheduled(controller: ScheduledController, environment: unknown, context: ExecutionContext): Promise<void> {
    // await dosomething();
  },*/
};
