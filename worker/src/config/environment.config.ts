import { AuthConfig } from './auth.config';
import { Config } from './config';
import { EndpointKeyConfig } from './endpoint-key.config';
import { Env } from './env.model';

export class EnvironmentConfig implements Config {
  readonly auth: AuthConfig = {
    audience: this.env.AUTH_AUDIENCE,
    clientId: this.env.AUTH_CLIENT_ID,
    clientSecret: this.env.AUTH_CLIENT_SECRET,
    connection: this.env.AUTH_CONNECTION,
    domain: this.env.AUTH_DOMAIN,
  };
  readonly azure: EndpointKeyConfig = {
    endpoint: this.env.AZURE_ENDPOINT,
    key: this.env.AZURE_KEY,
  };
  readonly db: EndpointKeyConfig = {
    endpoint: this.env.COSMOS_ENDPOINT,
    key: this.env.COSMOS_KEY,
  };
  readonly mailgun: EndpointKeyConfig = {
    endpoint: this.env.MAILGUN_ENDPOINT,
    key: this.env.MAILGUN_KEY,
  };

  readonly appInsightsKey = this.env.APP_INSIGHTS_KEY;
  readonly bucketSnapshots = this.env.BUCKET_SNAPSHOTS;
  readonly bucketStatics = this.env.BUCKET_STATICS;
  readonly corsOrigins = this.env.CORS_ORIGINS;
  readonly debug = this.env.DEBUG === 'true';
  readonly kvAuth = this.env.KV_AUTH;
  readonly kvData = this.env.KV_DATA;
  readonly kvBypass = (this.env.KV_BYPASS ?? '').split(',');
  readonly inviteTemplateId = this.env.INVITE_TEMPLATE_ID;

  constructor(private readonly env: Env) {}
}
