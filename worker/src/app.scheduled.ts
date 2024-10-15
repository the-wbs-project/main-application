import { Env } from './config';
import { DataDogService, DataServiceFactory, Fetcher, JobLogger, JobOriginService, MailGunService } from './services';

export const APP_SCHEDULED = {
  async run(event: any, env: Env, ctx: ExecutionContext): Promise<void> {
    var datadog = new DataDogService(env);
    var logger = new JobLogger(env, datadog);
    var fetcher = new Fetcher(logger);
    var origin = new JobOriginService(env, fetcher);
    var data = new DataServiceFactory(env, ctx, origin);
    var mailgun = new MailGunService(env, fetcher, logger);

    try {
      await mailgun.getEventsAsync();
    } catch (e) {
      logger.trackException('An error occured trying to get resources.', <Error>e);
    }

    await datadog.flush();
  },
};
