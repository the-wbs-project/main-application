import { Env } from '../config';
import { MailMessage, PublishedEmailQueueMessage } from '../models';
import { Logger } from './logging';
import { MailBuilderService } from './mail-builder.service';
import { MailGunService } from './mail-gun.service';

export class QueueService {
  constructor(
    private readonly env: Env,
    private readonly logger: Logger,
    private readonly mailBuilder: MailBuilderService,
    private readonly mailgun: MailGunService,
  ) {}

  async sendMail(batch: MessageBatch): Promise<void> {
    //
    //    We are sending emails!!
    //
    for (const message of batch.messages) {
      try {
        const mailMessage = message.body as MailMessage;

        const success = await this.mailgun.send(mailMessage);

        if (success) {
          message.ack();
        } else {
          message.retry({
            delaySeconds: 60, // delay 1 minute
          });
        }
      } catch (e) {
        this.logger.trackException('Error sending mail', <Error>e);

        message.retry({
          delaySeconds: 60, // delay 1 minute
        });
      }
    }
  }

  async versionPublished(batch: MessageBatch): Promise<void> {
    //
    //    We are sending emails!!
    //
    for (const message of batch.messages) {
      try {
        await this.mailBuilder.libraryVersionPublished(message.body as PublishedEmailQueueMessage);

        message.ack();
      } catch (e) {
        console.log('Error processing published version for email', <Error>e);
        this.logger.trackException('Error processing published version for email', <Error>e);

        message.retry({
          delaySeconds: 60, // delay 1 minute
        });
      }
    }
  }
}
