import { AssetManifestType } from '@cloudflare/kv-asset-handler/dist/types';
import { AuthConfig } from './auth.config';
import { AzureConfig } from './azure.config';
import { Config } from './config';
import { DbConfig } from './db.config';
import { Env } from './env.model';
import { MailgunConfig } from './mailgun.config';
import { TwilioConfig } from './twilio.config';

export class EnvironmentConfig implements Config {
  private _auth: AuthConfig | undefined;
  private _azure: AzureConfig | undefined;
  private _db: DbConfig | undefined;
  private _mailgun: MailgunConfig | undefined;
  private _twilio: TwilioConfig | undefined;

  constructor(private readonly env: Env) {}

  get bucketSnapshots(): R2Bucket {
    return this.env.BUCKET_SNAPSHOTS;
  }

  get bucketStatics(): R2Bucket {
    return this.env.BUCKET_STATICS;
  }

  get kvAuth(): KVNamespace {
    return this.env.KV_AUTH;
  }

  get kvData(): KVNamespace {
    return this.env.KV_DATA;
  }

  get kvSite(): KVNamespace {
    return this.env.__STATIC_CONTENT;
  }

  get appInsightsKey(): string {
    return this.env.APP_INSIGHTS_KEY;
  }

  get appInsightsSnippet(): string | undefined {
    return this.env.SNIPPET_APP_INSIGHTS;
  }

  get auth(): AuthConfig {
    if (!this._auth) this._auth = this.json(this.env.AUTH);
    return <AuthConfig>this._auth;
  }

  get azure(): AzureConfig {
    if (!this._azure) this._azure = this.json(this.env.AZURE);
    return <AzureConfig>this._azure;
  }

  get db(): DbConfig {
    if (!this._db) this._db = this.json(this.env.COSMOS);
    return <DbConfig>this._db;
  }

  get debug(): boolean {
    return this.env.DEBUG === 'true';
  }

  get inviteEmail(): string {
    return this.env.INVITE_EMAIL;
  }

  get kvBypass(): string[] {
    return (this.env.KV_BYPASS ?? '').split(',');
  }

  get mailgun(): MailgunConfig {
    if (!this._mailgun)
      this._mailgun = {
        url: this.env.MAILGUN_API_BASE_URL,
        key: this.env.MAILGUN_API_KEY,
      };
    return this._mailgun;
  }

  get manifestSite(): AssetManifestType {
    return this.env.__STATIC_CONTENT_MANIFEST;
  }

  get twilio(): TwilioConfig {
    if (!this._twilio) this._twilio = this.json(this.env.TWILIO);
    return <TwilioConfig>this._twilio;
  }

  private json(value: string | null | undefined): any {
    return typeof value === 'undefined' || value == null ? {} : JSON.parse(value);
  }
}
