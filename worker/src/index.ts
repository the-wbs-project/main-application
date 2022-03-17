import { EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { CosmosFactory } from './services/database-services/cosmos';
import { CloudflareEdgeService } from './services/edge-services/cloudflare';
import { ServiceFactory } from './services/factory.service';
import { Logger } from './services/logger.service';

let services: ServiceFactory | undefined;
const config = new EnvironmentConfig();
const logger = new Logger(config.appInsightsKey);

addEventListener('fetch', (event) => {
  if (!services) services = new ServiceFactory(config);
  const edge = new CloudflareEdgeService(config, event);
  const cosmos = new CosmosFactory(config, logger, event.request);
  const request = new WorkerRequest(event, cosmos, edge, logger);

  event.respondWith(services.router.matchAsync(request));
});
