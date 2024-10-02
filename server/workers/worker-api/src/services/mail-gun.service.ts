import { Context, Env } from '../config';
import { EMAILS } from '../emails';
import { Fetcher } from './fetcher.service';
import { Logger } from './logging';

export class MailGunService {
  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async handleHomepageInquiryAsync(ctx: Context): Promise<Response> {
    const blob = await ctx.req.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;

    const success = await this.sendMailAsync([this.env.EMAIL_ADMIN], 'New Inquiry From Homepage', html);

    return ctx.newResponse(null, success ? 204 : 500);
  }

  async sendWatcherEmail(data: any[]): Promise<boolean> {
    const html = EMAILS.WATCHER;

    return this.sendMailAsync([this.env.EMAIL_ADMIN], 'Rick Rater - Daily Test Email', html);
  }

  async sendTestEmail(data: any[]): Promise<void> {
    let html = '<html><body>';

    for (const item of data) {
      html += `<p>${item.header}: `;

      if (item.passes) {
        html += `<span style="color: green;">Pass</span>`;
      } else {
        html += `<span style="color: red;">Failed - ${item.error}</span>`;
      }

      html += '</p>';
    }

    html += '</body></html>';

    await this.sendMailAsync([this.env.EMAIL_ADMIN], 'Rick Rater - Daily Test Email', html);
  }

  private async sendMailAsync(toList: string[], subject: string, html: string): Promise<boolean> {
    const to = toList.join(',');
    const data: any = {
      to,
      html,
      subject,
      from: this.env.EMAIL_FROM,
      'h:sender': this.env.EMAIL_FROM,
    };
    if (this.env.EMAIL_ADMIN && !to.includes(this.env.EMAIL_ADMIN)) {
      data.bcc = this.env.EMAIL_ADMIN;
    }
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
