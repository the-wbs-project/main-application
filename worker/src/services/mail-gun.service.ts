import { Context } from '../config';

interface EmailRequestBlob {
  email: string;
  name: string;
  subject: string;
  message: string;
}
declare type EmailData = Record<string, any>;

export class MailGunService {
  static async handleHomepageInquiryAsync(ctx: Context): Promise<Response> {
    const blob: EmailRequestBlob = await ctx.req.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;

    return await MailGunService.sendMail(ctx, {
      from: 'Homepage <homepage@thewbsproject.com>',
      to: 'chrisw@thewbsproject.com',
      subject: `New Inquiry From Homepage`,
      html,
    });
  }

  /*static inviteAsync(ctx: Context, invite: Invite): Promise<Response> {
    const origin = ctx.req.headers.get('origin');
    const url = `${origin}/setup/${invite.id}`;

    return MailGunService.sendMail(ctx, {
      to: invite.email,
      from: 'The WBS Project Support <support@thewbsproject.com>',
      subject: `You have been invited to join The WBS Project Beta`,
      template: ctx.env.INVITE_TEMPLATE_ID,
      'h:X-Mailgun-Variables': JSON.stringify({ url }),
    });
  }*/

  static async sendMail(ctx: Context, data: EmailData): Promise<Response> {
    const dataUrlEncoded = this.urlEncodeObject(data);

    return ctx.var.fetcher.fetch(`${ctx.env.MAILGUN_ENDPOINT}/messages`, {
      method: 'POST',
      headers: {
        //Authorization: 'Basic ' + Buffer.from('api:' + ctx.env.MAILGUN_KEY).toString(),
        Authorization: 'Basic ' + btoa('api:' + ctx.env.MAILGUN_KEY),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': dataUrlEncoded.length.toString(),
      },
      body: dataUrlEncoded,
    });
  }

  private static urlEncodeObject(obj: EmailData) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }
}
