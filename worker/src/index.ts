import { EnvironmentConfig } from './config';
import { WorkerRequest } from './services';
import { Auth0Service, AuthenticationService } from './services/auth-services';
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
  const auth0 = new Auth0Service(config.auth);
  const dbFactory = new DataServiceFactory(auth0, config, cosmos, edge);
  const auth = new AuthenticationService(auth0, config.auth);
  const request = new WorkerRequest(
    event,
    auth,
    config,
    dbFactory,
    edge,
    logger,
  );

  event.respondWith(services.router.matchAsync(request));
});
