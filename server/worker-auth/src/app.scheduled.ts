import { Env } from './config';
import { Auth0Service, DataDogService, Fetcher, JobLogger } from './services';

export const APP_SCHEDULED = async (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
  const datadog = new DataDogService(env);
  const logger = new JobLogger(env, datadog, 'scheduler');
  const fetcher = new Fetcher(logger);
  const auth0 = new Auth0Service(env, fetcher, logger);

  try {
    //await userSearch.verifyIndex();

    console.log(await auth0.organizations.getAllAsync());
    console.log(await auth0.organizations.getAllAsync());
  } catch (e) {
    console.log(e);
    logger.trackException('An error occured trying to process a scheduled job.', <Error>e);
  } finally {
    ctx.waitUntil(datadog.flush());
  }
};
