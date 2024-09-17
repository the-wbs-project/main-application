import { Env, QUEUES } from './config';
import { Auth0Service, DataDogService, DataServiceFactory, Fetcher, JobLogger, QueueService } from './services';

export const APP_QUEUE = async (batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> => {
  const datadog = new DataDogService(env);
  const logger = new JobLogger(env, datadog, batch.queue);
  const fetcher = new Fetcher(logger);
  const data = new DataServiceFactory(new Auth0Service(env, fetcher, logger), logger, env.KV_DATA, ctx);
  const queue = new QueueService(data, env);

  try {
    console.log(batch.queue === QUEUES.REFRESH_ALL);
    if (batch.queue === QUEUES.REFRESH_ALL) {
      await queue.refreshAllAsync();

      batch.ackAll();
      logger.trackEvent('Executed ' + batch.queue, 'Info');
    }
  } catch (e) {
    logger.trackException('An error occured trying to process a queue message.', <Error>e);
  } finally {
    ctx.waitUntil(datadog.flush());
  }
};
