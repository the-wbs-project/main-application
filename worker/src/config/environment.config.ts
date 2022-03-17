import { AuthConfig } from './auth.config';
import { Config } from './config';
import { DbConfig } from './db.config';
import { MailgunConfig } from './mailgun.config';
import { TtlConfig } from './ttl.config';
import { TwilioConfig } from './twilio.config';

export class EnvironmentConfig implements Config {
  private _auth: AuthConfig | undefined;
  private _db: DbConfig | undefined;
  private _kvBypass: string[] | undefined;
  private _mailgun: MailgunConfig | undefined;
  private _ttl: TtlConfig | undefined;
  private _twilio: TwilioConfig | undefined;

  get appInsightsKey(): string {
    return APP_INSIGHTS_KEY;
  }

  get appInsightsSnippet(): string {
    return SNIPPET_APP_INSIGHTS;
  }

  get auth(): AuthConfig {
    if (!this._auth) this._auth = this.json(AUTH);
    return <AuthConfig>this._auth;
  }

  get db(): DbConfig {
    if (!this._db) this._db = this.json(COSMOS);
    return <DbConfig>this._db;
  }

  get debug(): boolean {
    return DEBUG === 'true';
  }

  get kvBypass(): string[] {
    if (this._kvBypass == null) this._kvBypass = KV_BYPASS.split(',');
    return this._kvBypass;
  }

  get mailgun(): MailgunConfig {
    if (!this._mailgun)
      this._mailgun = {
        url: MAILGUN_API_BASE_URL,
        key: MAILGUN_API_KEY,
      };
    return this._mailgun;
  }

  get ttl(): TtlConfig {
    if (!this._ttl)
      this._ttl = {
        fonts: TTL_FONTS,
        icons: TTL_ICONS,
        images: TTL_IMAGES,
        jscss: TTL_JSSCSS,
        manifest: TTL_MANIFEST,
      };
    return this._ttl;
  }

  get twilio(): TwilioConfig {
    if (!this._twilio) this._twilio = this.json(TWILIO);
    return <TwilioConfig>this._twilio;
  }

  private json(value: string | null | undefined): any {
    return typeof value === 'undefined' || value == null
      ? {}
      : JSON.parse(value);
  }
}
