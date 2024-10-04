import { Env } from './config';
import {
  DataDogService,
  Fetcher,
  MailGunService,
  JobLogger,
  QueueService,
  MailBuilderService,
  DataServiceFactory,
  JobOriginService,
} from './services';

const QUEUES = {
  SEND_MAIL: 'send-mail',
  VERSION_PUBLISHED: 'version-published',
};

export const APP_QUEUE = {
  async run(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    const datadog = new DataDogService(env);
    const logger = new JobLogger(env, datadog);
    const fetcher = new Fetcher(logger);
    const origin = new JobOriginService(env, fetcher);
    const data = new DataServiceFactory(env, ctx, origin);
    const mailgun = new MailGunService(env, fetcher, logger);
    const mailBuilder = new MailBuilderService(data, env);
    const queue = new QueueService(env, logger, mailBuilder, mailgun);

    console.log(`${batch.queue}: Starting (${batch.messages.length})`);

    if (batch.queue === QUEUES.SEND_MAIL) {
      await queue.sendMail(batch);
    } else if (batch.queue === QUEUES.VERSION_PUBLISHED) {
      await queue.versionPublished(batch);
    }

    console.log(`${batch.queue}: Done`);
    await datadog.flush();
  },
};
