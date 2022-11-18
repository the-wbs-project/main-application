import { AuthConfig } from '../../config';
import { User, UserLite } from '../../models';
import { WorkerRequest } from '../worker-request.service';

export class Auth0Service {
  constructor(private readonly config: AuthConfig) {}

  toUser(payload: Record<string, any>): User {
    const user: User = {
      blocked: payload.blocked ?? false,
      appInfo: payload.app_metadata || {},
      createdAt: payload.created_at,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      id: payload.user_id,
      lastLogin: payload.last_login,
      loginsCount: payload.logins_count,
      userInfo: payload.user_metadata || {},
    };
    return user;
  }

  toLiteUser(payload: Record<string, any>): UserLite {
    const user: UserLite = {
      email: payload.email,
      name: payload.name,
      id: payload.user_id,
    };
    return user;
  }

  getSetupRedirectUrl(state: string, inviteCode: string): string {
    const c = this.config;
    const state2 = encodeURIComponent(state);
    const callback = encodeURIComponent(this.config.callbackUrl);

    return `https://${c.domain}/authorize?response_type=code&client_id=${c.authClientId}&redirect_uri=${callback}&scope=openid%20profile%20email&state=${state2}&inviteCode=${inviteCode}`;
  }

  async generateStateParamAsync(req: WorkerRequest): Promise<string> {
    const resp = await req.myFetch(new Request('https://csprng.xyz/v1/api', { method: 'get' }));
    let { Data: state }: { Data: string } = await resp.json();

    while (state.indexOf('|') > -1) state = state.replace('|', '-');

    return state;
  }

  async getMgmtTokenAsync(req: WorkerRequest): Promise<string> {
    const url = `https://${this.config.domain}/oauth/token`;
    const body = {
      client_id: this.config.mgmtClientId,
      client_secret: this.config.mgmtClientSecret,
      audience: this.config.audience,
      grant_type: 'client_credentials',
    };
    const response = await req.myFetch(
      new Request(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }),
    );

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const respBody: { access_token: string } = await response.json();

    return respBody.access_token;
  }

  async makeAuth0CallAsync(req: WorkerRequest, urlSuffix: string, method: string, body?: unknown): Promise<Response> {
    const token = await this.getMgmtTokenAsync(req);

    return await req.myFetch(
      new Request(`https://${this.config.domain}/api/v2/${urlSuffix}`, {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
  }
}