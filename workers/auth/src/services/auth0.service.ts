import { AuthConfig } from '../config';
import { AuthToken } from '../models';

export class Auth0Service {
  constructor(private readonly config: AuthConfig) {}

  async getAuthTokenAsync(req: Request): Promise<AuthToken | null> {
    const url = new URL(req.url);
    const auth0Code = url.searchParams.get('code');

    if (!auth0Code) return null;

    const body = JSON.stringify({
      code: auth0Code,
      grant_type: 'authorization_code',
      client_id: this.config.authClientId,
      client_secret: this.config.authClientSecret,
      redirect_uri: this.config.callbackUrl,
    });
    const tokenResponse = await fetch(`https://${this.config.domain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
    const tokenBody: AuthToken = await tokenResponse.json();

    if (tokenBody.error) {
      throw new Error(tokenBody.error);
    }
    return tokenBody;
  }

  getLoginRedirectUrl(origin: string, state: string): string {
    const c = this.config;
    const state2 = encodeURIComponent(state);
    const callback = encodeURIComponent(this.config.callbackUrl);
    const protocol = origin.indexOf('localhost') === -1 ? 'https' : 'http';

    return `${protocol}://${c.domain}/authorize?response_type=code&client_id=${c.authClientId}&redirect_uri=${callback}&scope=openid%20profile%20email&state=${state2}`;
  }

  getSetupRedirectUrl(state: string, inviteCode: string): string {
    const c = this.config;
    const state2 = encodeURIComponent(state);
    const callback = encodeURIComponent(this.config.callbackUrl);

    return `https://${c.domain}/authorize?response_type=code&client_id=${c.authClientId}&redirect_uri=${callback}&scope=openid%20profile%20email&state=${state2}&inviteCode=${inviteCode}`;
  }

  getLogoutUrl(origin: string): string {
    const c = this.config;

    return `https://${c.domain}/v2/logout?returnTo=${origin}%2Floggedout&client_id=${c.authClientId}`;
  }

  async generateStateParamAsync(): Promise<string> {
    const resp = await fetch(new Request('https://csprng.xyz/v1/api', { method: 'get' }));
    let { Data: state }: { Data: string } = await resp.json();

    while (state.indexOf('|') > -1) state = state.replace('|', '-');

    return state;
  }
}
