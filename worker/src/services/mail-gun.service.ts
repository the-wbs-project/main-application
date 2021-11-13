export interface EmailRequestBlob {
  email: string;
  name: string;
  subject: string;
  message: string;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string;
  bcc?: string;
  'h-Reply-To'?: string;
  'o:testmode'?: boolean;
}

export class MailGunService {
  private urlEncodeObject(obj: { [s: string]: any }) {
    return Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }

  async handleRequestAsync(request: Request): Promise<Response> {
    const blob: EmailRequestBlob = await request.json();
    const html = `
    <p>Name: ${blob.name}</p>
    <p>Subject: ${blob.subject}</p>
    <p>Messasge: ${blob.message}</p>`;
    const data: EmailData = {
      from: 'Homepage <homepage@thewbsproject.com>',
      to: 'chrisw@thewbsproject.com',
      subject: `New Inquiry From Homepage`,
      html,
    };
    return await this.sendMail(data);
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
