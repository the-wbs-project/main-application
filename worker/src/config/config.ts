import { AuthConfig } from './auth.config';
import { EndpointKeyConfig } from './endpoint-key.config';

export interface Config {
  appInsightsKey: string;
  appInsightsSnippet?: string;
  auth: AuthConfig;
  azure: EndpointKeyConfig;
  corsOrigins: string;
  db: EndpointKeyConfig;
  debug: boolean;
  inviteTemplateId: string;
  kvBypass: string[];
  mailgun: EndpointKeyConfig;
  bucketSnapshots: R2Bucket;
  bucketStatics: R2Bucket;
  kvAuth: KVNamespace;
  kvData: KVNamespace;
}
