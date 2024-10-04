import { Env } from '../config';
import { MailMessage } from '../models';
import { Fetcher } from './fetcher.service';
import { Logger } from './logging';

export class MailGunService {
  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async send({ toList, bccList, subject, html }: MailMessage): Promise<boolean> {
    if (toList == null) toList = [];
    if (bccList == null) bccList = [];

    if (this.env.EMAIL_ADMIN && !toList.includes(this.env.EMAIL_ADMIN)) {
      bccList.push(this.env.EMAIL_ADMIN);
    }

    const data: any = {
      html,
      subject,
      to: toList.join(','),
      bcc: bccList.join(','),
      from: this.env.EMAIL_FROM,
      'h:sender': this.env.EMAIL_FROM,
    };
    const dataUrlEncoded = this.urlEncodeObject(data);

    const resp = await this.fetcher.fetch(`${this.env.MAILGUN_ENDPOINT}/messages`, {
      method: 'POST',
      headers: {
        //Authorization: 'Basic ' + Buffer.from('api:' + ctx.env.MAILGUN_KEY).toString(),
        Authorization: 'Basic ' + btoa('api:' + this.env.MAILGUN_KEY),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': dataUrlEncoded.length.toString(),
      },
      body: dataUrlEncoded,
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Error sending email', 'Error', {
        status: resp.status,
        statusText: resp.statusText,
        requestBody: data,
        responseBody: await resp.json(),
      });
    } else {
      this.logger.trackEvent('Email sent successfully', 'Info', {
        requestBody: data,
        responseBody: await resp.json(),
      });
    }

    return resp.status === 200;
  }

  private urlEncodeObject(obj: Record<string, any>) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }
}
