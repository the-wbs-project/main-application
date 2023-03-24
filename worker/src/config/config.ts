import { AuthConfig } from './auth.config';
import { AzureConfig } from './azure.config';
import { DbConfig } from './db.config';
import { MailgunConfig } from './mailgun.config';
import { TwilioConfig } from './twilio.config';

export interface Config {
  appInsightsKey: string;
  appInsightsSnippet?: string;
  auth: AuthConfig;
  azure: AzureConfig;
  db: DbConfig;
  debug: boolean;
  inviteTemplateId: string;
  kvBypass: string[];
  mailgun: MailgunConfig;
  twilio: TwilioConfig;
  bucketSnapshots: R2Bucket;
  bucketStatics: R2Bucket;
  kvAuth: KVNamespace;
  kvData: KVNamespace;
}
