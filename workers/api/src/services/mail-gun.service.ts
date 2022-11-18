import { Config } from '../config';
import { Invite } from '../models';
import { WorkerRequest } from './worker-request.service';
import INVITE_EMAIL from '../blobs/invite.html';

interface EmailRequestBlob {
  email: string;
  name: string;
  subject: string;
  message: string;
}
declare type EmailData = Record<string, string>;

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
    const html = INVITE_EMAIL.replace('{url}', `${origin}/setup/${invite.id}`);

    return this.sendMail(req, {
      from: 'The WBS Project Support <support@thewbsproject.com>',
      to: invite.email,
      subject: `You have been invited to join The WBS Project Beta`,
      html,
    });
  }

  async sendMail(req: WorkerRequest, data: EmailData): Promise<Response> {
    const dataUrlEncoded = this.urlEncodeObject(data);

    return req.myFetch(`${this.config.mailgun.url}/messages`, {
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
