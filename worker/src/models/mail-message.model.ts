export interface HtmlMailMessage {
  toList?: string[];
  bccList?: string[];
  type: 'html';
  subject: string;
  html: string;
}

export interface TemplateMailMessage {
  toList?: string[];
  bccList?: string[];
  type: 'template';
  templateId: string;
  subject: string;
  data: any;
}

export type MailMessage = HtmlMailMessage | TemplateMailMessage;
