import { Env } from './config';
import { MailMessage } from './models';
import { DataDogService, Fetcher, MailGunService, JobLogger } from './services';

const QUEUES = {
  SEND_MAIL: 'send-mail',
};

export const APP_QUEUE = {
  async run(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Running queue');
    var datadog = new DataDogService(env);
    var logger = new JobLogger(env, datadog);
    var fetcher = new Fetcher(logger);
    var mailgun = new MailGunService(env, fetcher, logger);

    if (batch.queue === QUEUES.SEND_MAIL) {
      //
      //    We are sending emails!!
      //
      for (const message of batch.messages) {
        try {
          const mailMessage = message.body as MailMessage;

          const success = await mailgun.send(mailMessage);

          if (success) {
            message.ack();
          } else {
            message.retry({
              delaySeconds: 60, // delay 1 minute
            });
          }
        } catch (e) {
          logger.trackException('Error sending mail', <Error>e);

          message.retry({
            delaySeconds: 60, // delay 1 minute
          });
        }
      }
    }
  },
};
