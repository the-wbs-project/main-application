import { AuthConfig } from './auth.config';
import { AzureConfig } from './azure.config';
import { DbConfig } from './db.config';
import { MailgunConfig } from './mailgun.config';
import { TtlConfig } from './ttl.config';
import { TwilioConfig } from './twilio.config';

export interface Config {
  appInsightsKey: string;
  appInsightsSnippet: string;
  auth: AuthConfig;
  azure: AzureConfig;
  db: DbConfig;
  debug: boolean;
  inviteEmail: string;
  kvBypass: string[];
  mailgun: MailgunConfig;
  ttl: TtlConfig;
  twilio: TwilioConfig;
  bucketSnapshots: R2Bucket;
  kvAuth: KVNamespace;
  kvData: KVNamespace;
  kvSite: KVNamespace;
}
