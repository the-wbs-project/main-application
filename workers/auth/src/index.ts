import { AuthConfig, Env } from './config';
import { Auth0Service, AuthDataService, AuthenticationService, CloudflareDataService, RouterService, WorkerContext } from './services';

const router = new RouterService();

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const edge = new CloudflareDataService(context, env.KV_AUTH);
    const config: AuthConfig = JSON.parse(env.AUTH);
    const auth0 = new Auth0Service(config);
    const data = new AuthDataService(edge);
    const service = new AuthenticationService(auth0, config, data);
    const workerContext = new WorkerContext(request, service);

    return await router.matchAsync(workerContext);
  },
};
