import { AuthConfig } from './auth.config';
import { DbConfig } from './db.config';
import { MailgunConfig } from './mailgun.config';
import { TtlConfig } from './ttl.config';
import { TwilioConfig } from './twilio.config';

export interface Config {
  appInsightsKey: string;
  appInsightsSnippet: string;
  auth: AuthConfig;
  db: DbConfig;
  debug: boolean;
  kvBypass: string[];
  mailgun: MailgunConfig;
  ttl: TtlConfig;
  twilio: TwilioConfig;
}
