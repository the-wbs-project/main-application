import { Env } from '../../../config';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';

export class Auth0TokenService {
  private kvKey = 'auth0-mgmt-token';

  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async getToken(): Promise<string> {
    let token = await this.env.KV_DATA.get(this.kvKey);

    if (token) return token;

    token = await this.getTokenAsync();

    await this.env.KV_DATA.put(this.kvKey, token, { expirationTtl: 60 * 60 });

    return token;
  }

  private async getTokenAsync(): Promise<string> {
    var body = {
      client_id: this.env.AUTH_M2M_CLIENT_ID,
      client_secret: this.env.AUTH_M2M_CLIENT_SECRET,
      audience: this.env.AUTH_AUDIENCE,
      grant_type: 'client_credentials',
    };
    this.logger.trackEvent('token call', 'Notice', { body, url: `https://${this.env.AUTH_DOMAIN}/oauth/token` });

    var resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 token', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 token');
    }
    const respBody: any = await resp.json();

    return respBody.access_token;
  }
}
