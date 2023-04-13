import { Config } from '../config';
import { Invite } from '../models';
import { WorkerRequest } from './worker-request.service';

interface EmailRequestBlob {
  email: string;
  name: string;
  subject: string;
  message: string;
}
declare type EmailData = Record<string, any>;

export class MailGunService {
  constructor(private readonly config: Config) {}

  private urlEncodeObject(obj: EmailData) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }

  async handleHomepageInquiryAsync(req: WorkerRequest): Promise<Response> {
    if (!req.request.json) return new Response('Error', { status: 500 });

    const blob: EmailRequestBlob = await req.request.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;

    return await this.sendMail(req, {
      from: 'Homepage <homepage@thewbsproject.com>',
      to: 'chrisw@thewbsproject.com',
      subject: `New Inquiry From Homepage`,
      html,
    });
  }

  inviteAsync(req: WorkerRequest, invite: Invite): Promise<Response> {
    const origin = new URL(req.url).origin;
    const url = `${origin}/setup/${invite.id}`;

    return this.sendMail(req, {
      to: invite.email,
      from: 'The WBS Project Support <support@thewbsproject.com>',
      subject: `You have been invited to join The WBS Project Beta`,
      template: this.config.inviteTemplateId,
      'h:X-Mailgun-Variables': JSON.stringify({ url }),
    });
  }

  async sendMail(req: WorkerRequest, data: EmailData): Promise<Response> {
    const dataUrlEncoded = this.urlEncodeObject(data);

    return req.myFetch(`${this.config.mailgun.endpoint}/messages`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('api:' + this.config.mailgun.key),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': dataUrlEncoded.length.toString(),
      },
      body: dataUrlEncoded,
    });
  }
}
