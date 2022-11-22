import { EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { DataServiceFactory } from './services/data-services';
import { CosmosFactory } from './services/database-services/cosmos';
import { CloudflareService } from './services/edge-services/cloudflare';
import { ServiceFactory } from './services/factory.service';
import { Logger } from './services/logger.service';
import { CloudflareStorageFactory } from './services/storage-services/cloudflare/cloudflare-storage-factory.service';

export default {
  async fetch(request: Request, environment: any, context: ExecutionContext): Promise<Response> {
    const start = new Date();
    const config = new EnvironmentConfig(environment);
    const logger = new Logger(config.appInsightsKey, request);
    let workerRequest: WorkerRequest | null = null;
    let response: Response | null = null;

    try {
      const db = new CosmosFactory(config, logger);
      const edge = new CloudflareService(config, request, context);
      const storage = new CloudflareStorageFactory(config);
      const data = new DataServiceFactory(db, edge, request, storage);
      const services = new ServiceFactory(config, data, edge, storage);

      workerRequest = new WorkerRequest(request, config, services, logger);

      response = await services.router.matchAsync(workerRequest);
    } catch (err) {
      if (workerRequest) {
        //@ts-ignore
        workerRequest.logException('An uncaught error occured.', 'WorkerService.handleRequest', err);
      }
      response = new Response((<Error>err).message, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
    const duration = Math.abs(new Date().getTime() - start.getTime());

    logger.trackRequest(request, response, duration * 1000);

    context.waitUntil(logger.flush());

    return response;
  },
};
