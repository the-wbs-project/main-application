import { EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { DataServiceFactory } from './services/data-services';
import { CosmosFactory } from './services/database-services/cosmos';
import { CloudflareEdgeService } from './services/edge-services/cloudflare';
import { ServiceFactory } from './services/factory.service';
import { Logger } from './services/logger.service';

const config = new EnvironmentConfig();

addEventListener('fetch', (event) => {
  const logger = new Logger(config.appInsightsKey, event.request);
  const edge = new CloudflareEdgeService(config, event);
  const services = new ServiceFactory(
    config,
    new DataServiceFactory(new CosmosFactory(config, logger), edge),
    edge,
  );
  const request = new WorkerRequest(event, config, services, logger);

  event.respondWith(services.router.matchAsync(request));
});
