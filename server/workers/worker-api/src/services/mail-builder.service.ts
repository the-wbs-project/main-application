import { Context, Env } from '../config';
import { EMAILS } from '../emails';
import { MailMessage } from '../models';

export class MailBuilderService {
  constructor(private readonly env: Env) {}

  async handleHomepageInquiryAsync(ctx: Context): Promise<Response> {
    const blob = await ctx.req.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;

    await this.queue({
      toList: [this.env.EMAIL_ADMIN],
      subject: 'New Inquiry From Homepage',
      html,
    });

    return ctx.newResponse(null, 202);
  }

  async sendWatcherEmail(data: any[]): Promise<void> {
    const html = EMAILS.WATCHER;

    await this.queue({
      toList: [this.env.EMAIL_ADMIN],
      subject: 'Rick Rater - Daily Test Email',
      html,
    });
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

    await this.queue({
      toList: [this.env.EMAIL_ADMIN],
      subject: 'Rick Rater - Daily Test Email',
      html,
    });
  }

  private queue(message: MailMessage): Promise<void> {
    return this.env.SEND_MAIL.send(message);
  }
}
