import { API_ROUTES } from './app.routes';
import { APP_SCHEDULED } from './app.scheduled';

export default {
  fetch: API_ROUTES.fetch,
  scheduled: APP_SCHEDULED.run,
};
/*
export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    //
  },
  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {

    const datadog = new DataDogService(env);
    const logger = new JobLogger(env, datadog, batch.queue);

    try {
      if (batch.queue.startsWith('wbs-jira-sync')) {
        const message = batch.messages[0];

        batch.ackAll();
        logger.trackEvent('Executed ' + batch.queue, 'Info', <any>message.body);
      }
    } catch (e) {
      logger.trackException('An error occured trying to process a queue message.', <Error>e);
    } finally {
      ctx.waitUntil(datadog.flush());
    }
  },
};
*/
