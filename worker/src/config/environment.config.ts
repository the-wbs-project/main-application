import { Config } from './config';
import { DbConfig } from './db.config';
import { MailgunConfig } from './mailgun.config';

export class EnvironmentConfig implements Config {
  //private _auth: AuthConfig | undefined;
  private _db: DbConfig | undefined | null;
  private _mailgun: MailgunConfig | undefined | null;
  private _kvBypass: string[] | null = null;

  get appInsightsKey(): string {
    return APP_INSIGHTS_KEY;
  }

  get appInsightsSnippet(): string {
    return SNIPPET_APP_INSIGHTS;
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

  private json<T>(value: string | null | undefined): T | null {
    if (!value) return null;

    return JSON.parse(value);
  }
}
