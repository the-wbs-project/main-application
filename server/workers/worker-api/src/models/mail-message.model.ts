export interface MailMessage {
  toList?: string[];
  bccList?: string[];
  subject: string;
  html: string;
}
