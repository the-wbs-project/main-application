import { Request } from 'itty-router';

interface EmailRequestBlob {
  email: string;
  name: string;
  subject: string;
  message: string;
}
declare type EmailData = { [s: string]: string };

export class MailGunService {
  private urlEncodeObject(obj: EmailData) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }

  async handleRequestAsync(request: Request): Promise<Response> {
    if (!request.json) return new Response('Error', { status: 500 });

    const blob: EmailRequestBlob = await request.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;

    return await this.sendMail({
      from: 'Homepage <homepage@thewbsproject.com>',
      to: 'chrisw@thewbsproject.com',
      subject: `New Inquiry From Homepage`,
      html,
    });
  }

  async sendMail(data: EmailData): Promise<Response> {
    const dataUrlEncoded = this.urlEncodeObject(data);
    const opts = {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('api:' + MAILGUN_API_KEY),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': dataUrlEncoded.length.toString(),
      },
      body: dataUrlEncoded,
    };

    return fetch(`${MAILGUN_API_BASE_URL}/messages`, opts);
  }
}
