import { Context, Env } from '../config';
import { EMAILS } from '../emails';
import { MailMessage } from '../models';
import { DataServiceFactory } from './data-services';

export class MailBuilderService {
  constructor(private readonly data: DataServiceFactory, private readonly env: Env) {}

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

  async libraryVersionPublished(owner: string, entryId: string, versionId: number): Promise<void> {
    const html = EMAILS.LIBRARY_VERSION_PUBLISHED;
    const version = await this.data.libraryVersions.getByIdAsync(owner, entryId, versionId);

    if (!version) return;

    const userIds: string[] = [version.author];
    //
    //  Add editors
    //
    for (const editor of version.editors ?? []) {
      if (userIds.includes(editor)) continue;
      userIds.push(editor);
    }
    //
    //  Add watchers
    //
    for (const watcher of (await this.data.watchers.getWatchersAsync(owner, entryId)) ?? []) {
      if (userIds.includes(watcher)) continue;
      userIds.push(watcher);
    }
    //
    //  Now get the user Ids
    //
    const users = await Promise.all(userIds.map((id) => this.data.users.getBasicAsync(id)));

    for (const user of users) {
      if (!user) continue;

      await this.queue({
        toList: [user.email],
        subject: 'PM Empower - New Library Version Published',
        html,
      });
    }
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

  private async queue(message: MailMessage): Promise<void> {
    if (this.env.EMAIL_SUPRESS === 'true') {
      message.toList = message.toList.filter((to) => to !== this.env.EMAIL_ADMIN);
    }
    if (message.toList.length === 0) return;

    return await this.env.SEND_MAIL.send(message);
  }
}
