import { Context, Env } from '../config';
import { HtmlMailMessage, MailMessage, TemplateMailMessage } from '../models';
import { Fetcher } from './fetcher.service';
import { Logger } from './logging';

export class MailGunService {
  private readonly KV_SENT_KEY = 'MAIL_LAST_SENT';

  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async send(message: MailMessage): Promise<boolean> {
    if (message.type === 'html') {
      return this.sendHtmlMessage(message);
    } else if (message.type === 'template') {
      return this.sendTemplateMessage(message);
    } else {
      throw new Error('Invalid message type');
    }
  }

  async getTemplate(ctx: Context): Promise<Response> {
    const { templateId, version } = ctx.req.param();
    const resp = await this.fetcher.fetch(`${this.env.MAILGUN_ENDPOINT}/templates/${templateId}/versions/${version}`, {
      headers: {
        Authorization: 'Basic ' + btoa('api:' + this.env.MAILGUN_KEY),
      },
    });
    const body: { template: { version: { template: string } } } = await resp.json();

    return ctx.html(body.template.version.template);
  }

  async getEventsAsync(): Promise<void> {
    const lastSentValue = await this.env.KV_DATA.get(this.KV_SENT_KEY);

    if (!lastSentValue) return;

    const lastSent = parseInt(lastSentValue);

    // If anything was sent in the past 30 minutes, get the events
    if (Date.now() - lastSent < 30 * 60 * 1000) {
      const resp = await this.fetcher.fetch(`${this.env.MAILGUN_ENDPOINT}/events`, {
        headers: {
          Authorization: 'Basic ' + btoa('api:' + this.env.MAILGUN_KEY),
        },
      });
      const events: { items: { event: string; timestamp: number }[] } = await resp.json();

      for (const event of events.items) {
        // If anything was sent in the past 30 minutes, get the events
        if (Date.now() - event.timestamp < 30 * 60 * 1000) {
          //If this event is older than 30 minutes, ignore it
          if (event.event !== 'failed') continue;
          //if (event.timestamp < lastSent) continue;

          this.logger.trackEvent('Mailgun event', event.event == 'failed' ? 'Error' : 'Info', { event }, 'mailgun', 'pm-empower-mail');
        }
      }
    }
  }

  private async sendTemplateMessage({ toList, bccList, templateId, data }: TemplateMailMessage): Promise<boolean> {
    if (toList == null) toList = [];
    if (bccList == null) bccList = [];

    if (this.env.EMAIL_ADMIN && !toList.includes(this.env.EMAIL_ADMIN)) {
      bccList.push(this.env.EMAIL_ADMIN);
    }
    /*curl -s --user 'api:ENTER_API_KEY_HERE' \
	 https://api.mailgun.net/v3/email.pm-empower.com/messages \
	 -F from='Mailgun Sandbox <postmaster@email.pm-empower.com>' \
	 -F to='Christopher Walton <chrisw@thewbsproject.com>' \
	 -F subject='Hello Christopher Walton' \
	 -F template='invite' \
	 -F h:X-Mailgun-Variables='{"test": "test"}'
   */
    return this.sendToApi({
      template: templateId,
      to: toList.join(','),
      bcc: bccList.join(','),
      from: this.env.EMAIL_FROM,
      'h:sender': this.env.EMAIL_FROM,
      'h:X-Mailgun-Variables': JSON.stringify(data),
    });
  }

  private async sendHtmlMessage({ toList, bccList, subject, html }: HtmlMailMessage): Promise<boolean> {
    if (toList == null) toList = [];
    if (bccList == null) bccList = [];

    if (this.env.EMAIL_ADMIN && !toList.includes(this.env.EMAIL_ADMIN)) {
      bccList.push(this.env.EMAIL_ADMIN);
    }
    return this.sendToApi({
      html,
      subject,
      to: toList.join(','),
      bcc: bccList.join(','),
      from: this.env.EMAIL_FROM,
      'h:sender': this.env.EMAIL_FROM,
    });
  }

  private async sendToApi(formData: any): Promise<boolean> {
    const dataUrlEncoded = this.urlEncodeObject(formData);

    const resp = await this.fetcher.fetch(`${this.env.MAILGUN_ENDPOINT}/messages`, {
      method: 'POST',
      headers: {
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
        requestBody: formData,
        responseBody: await resp.json(),
      });
    } else {
      this.logger.trackEvent('Email sent successfully', 'Info', {
        requestBody: formData,
        responseBody: await resp.json(),
      });
    }

    await this.markSentAsync();

    return resp.status === 200;
  }

  private urlEncodeObject(obj: Record<string, any>) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }

  private async markSentAsync(): Promise<void> {
    await this.env.KV_DATA.put(this.KV_SENT_KEY, Date.now().toString());
  }
}
