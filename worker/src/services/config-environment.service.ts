import { Config } from './config.service';

export class ConfigEnvironment implements Config {
  private _corsUrl: string | undefined;

  get corsUrl(): string | undefined {
    if (!this._corsUrl) this._corsUrl = CORS_URLS;

    return this._corsUrl;
  }
}
