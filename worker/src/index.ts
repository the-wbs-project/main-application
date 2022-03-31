import { EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { DataServiceFactory } from './services/data-services';
import { CosmosFactory } from './services/database-services/cosmos';
import { CloudflareEdgeService } from './services/edge-services/cloudflare';
import { ServiceFactory } from './services/factory.service';
import { Logger } from './services/logger.service';

let services: ServiceFactory | undefined;
const config = new EnvironmentConfig();

addEventListener('fetch', (event) => {
  if (!services) services = new ServiceFactory(config);

  const logger = new Logger(config.appInsightsKey, event.request);
  const edge = new CloudflareEdgeService(config, event);
  const cosmos = new CosmosFactory(config, logger);
  const dbFactory = new DataServiceFactory(cosmos, edge);
  const request = new WorkerRequest(event, config, dbFactory, edge, logger);

  event.respondWith(services.router.matchAsync(request));
});
