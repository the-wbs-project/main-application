import { Context, Env } from '../config';
import { EMAILS } from '../emails';
import { MailMessage, ProjectCreatedQueueMessage, PublishedEmailQueueMessage } from '../models';
import { DataServiceFactory } from './data-services';
import { MailGunService } from './mail-gun.service';

export class MailBuilderService {
  constructor(private readonly data: DataServiceFactory, private readonly env: Env, private readonly mailgun: MailGunService) {}

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

  async libraryVersionPublished(message: PublishedEmailQueueMessage): Promise<void> {
    const html = EMAILS.LIBRARY_VERSION_PUBLISHED;
    const version = message.version;

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
    for (const watcher of message.watchers ?? []) {
      if (userIds.includes(watcher)) continue;
      userIds.push(watcher);
    }
    //
    //  Now get the user Ids
    //
    const users = await Promise.all(userIds.map((id) => this.data.users.getBasicAsync(id)));
    const bccList: string[] = [];

    for (const user of users) {
      if (!user) continue;
      bccList.push(user.email);
    }
    await this.queue(
      {
        html,
        bccList,
        subject: 'PM Empower - New Library Version Published',
      },
      true,
    );
  }

  async projectCreated(message: ProjectCreatedQueueMessage): Promise<void> {
    const html = EMAILS.PROJECT_CREATED;

    const userWithRoles = new Map<string, string[]>();
    //
    //  Add roles
    //
    for (const role of message.project.roles ?? []) {
      if (userWithRoles.has(role.userId)) userWithRoles.get(role.userId)!.push(role.role);
      else userWithRoles.set(role.userId, [role.role]);
    }
    if (userWithRoles.size === 0) return;
    //
    //  Now get the user Ids
    //
    const users = await Promise.all([...userWithRoles.keys()].map((id) => this.data.users.getBasicAsync(id)));
    const toList: string[] = [];

    for (const user of users) {
      if (!user) continue;
      toList.push(user.email);
    }
    await this.queue(
      {
        html,
        toList,
        subject: 'PM Empower - Project Created',
      },
      true,
    );
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

  private async queue(message: MailMessage, sendNow = false): Promise<void> {
    console.log('to list', message.toList);
    console.log('bcc list', message.bccList);

    if (this.env.EMAIL_SUPRESS === 'true') {
      message.toList = message.toList?.filter((to) => to === this.env.EMAIL_ADMIN);
      message.bccList = message.bccList?.filter((to) => to === this.env.EMAIL_ADMIN);
    }
    console.log('to list', message.toList);
    console.log('bcc list', message.bccList);

    if ([...(message.toList ?? []), ...(message.bccList ?? [])].length === 0) return;
    if (sendNow) {
      await this.mailgun.send(message);
    } else {
      await this.env.SEND_MAIL_QUEUE.send(message);
    }
  }
}
