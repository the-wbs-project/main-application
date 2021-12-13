import { uuid } from '@cfworker/uuid';
import * as cookie from 'cookie';
import { AuthConfig, AuthorizationModel, User } from '../models';
import { AuthDataService } from './data-services';
import { CONFIG } from './config.service';
import { WorkerCall } from './worker-call.service';

export class Auth0Service {
  private readonly config: AuthConfig;

  constructor(config: CONFIG, private readonly data: AuthDataService) {
    this.config = config.auth || {};
  }

  toUser(payload: any): User {
    const user: User = {
      id: payload['http://quotus.com/user_id'],
      fullName: payload['http://quotus.com/name'],
      userInfo: payload['http://quotus.com/user_metadata'],
      appInfo: payload['http://quotus.com/app_metadata'] || {},
      email: payload['email'],
    };
    return user;
  }

  async userUpdatedAsync(req: Request, user: User): Promise<void> {
    const stateCode = this.getStateCode(req);

    if (stateCode == null) return;

    const state = await this.data.getStateAsync(stateCode);

    if (!state || !state.identity || !state.verified) return;

    state.updatedValues = {
      fullName: user.fullName,
      phone: user.userInfo ? user.userInfo.phone : null,
    };

    await this.data.putStateAsync(stateCode, state);
  }

  async getSessionIdAsync(req: Request): Promise<string | null | undefined> {
    const stateCode = this.getStateCode(req);

    if (stateCode == null) return null;

    const state = await this.data.getStateAsync(stateCode);

    return state ? state.sessionId : null;
  }

  async getUserFromCodeAsync(call: WorkerCall): Promise<User | null> {
    const stateCode = this.getStateCode(call.request);
    const state = stateCode ? await this.data.getStateAsync(stateCode) : null;

    if (!state) return null;

    const authObject = state.identity;

    if (!authObject || !authObject.access_token) return null;

    return this.toUser(JSON.parse(this.decodeJWT(authObject.id_token)));
  }

  async handleRedirectAsync(call: WorkerCall): Promise<{
    headers?: { [key: string]: string };
    status?: number;
  } | null> {
    const url = new URL(call.request.url);
    const stateCode = url.searchParams.get('state');
    const auth0Code = url.searchParams.get('code');

    if (!stateCode || !auth0Code) return null;

    const storedState = await this.data.getStateAsync(stateCode);

    if (!storedState) return null;

    const body = JSON.stringify({
      code: auth0Code,
      grant_type: 'authorization_code',
      client_id: this.config.authClientId,
      client_secret: this.config.authClientSecret,
      redirect_uri: this.config.callbackUrl,
    });
    const tokenResponse = await call.fetch(
      this.config.domain + '/oauth/token',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      },
    );
    const tokenBody: { error: any; id_token: string } =
      await tokenResponse.json();

    if (tokenBody.error) {
      throw new Error(tokenBody.error);
    }
    const decoded = JSON.parse(this.decodeJWT(tokenBody.id_token));
    const validToken = this.validateToken(decoded);
    if (!validToken) {
      return { status: 401 };
    }

    storedState.code = auth0Code;
    storedState.identity = tokenBody;
    storedState.verified = false;
    storedState.sessionId = uuid();

    const userId = decoded['http://quotus.com/user_id'];

    await Promise.all([
      this.data.putStateAsync(stateCode, storedState),
      this.sessions.startSessionAsync(
        call,
        storedState.sessionId,
        userId,
        'User Logged In',
      ),
    ]);

    const secure = this.config.excludeSecureCookie ? '' : ' Secure;';
    const headers = {
      Location: '/verify',
      'Set-cookie': `${this.config.cookieKey}=${stateCode};${secure} HttpOnly; SameSite=Lax;`,
    };

    return { headers, status: 302 };
  }

  async markVerifiedAsync(code: string): Promise<void> {
    const state = await this.data.getStateAsync(code);

    state.verified = true;

    await this.data.putStateAsync(code, state);
  }

  async authorizeAsync(
    call: WorkerCall,
  ): Promise<
    [boolean, { authorization?: AuthorizationModel; redirectUrl?: string }]
  > {
    const authorization = await this.verifyAsync(call.request);

    if (authorization.accessToken) {
      return [true, { authorization }];
    } else {
      const state = await this.generateStateParamAsync(call);

      await this.data.putStateAsync(state, { exists: true, verified: false });

      return [false, { redirectUrl: this.redirectUrl(state) }];
    }
  }

  logout(info: WorkerCall, siteResponse: Response): Response | null {
    const cookieHeader = info.request.headers.get('Cookie');
    if (cookieHeader && cookieHeader.includes(this.config.cookieKey)) {
      const secure = this.config.excludeSecureCookie ? '' : ' Secure;';
      const headers = new Headers(siteResponse.headers);
      headers.set(
        'Set-cookie',
        `${this.config.cookieKey}="";auth0=""; HttpOnly;${secure} SameSite=Lax`,
      );

      return new Response(siteResponse.body, {
        ...siteResponse,
        headers: headers,
      });
    }
    return null;
  }

  getStateCode(req: Request): string | null {
    const key = this.config.cookieKey || '';
    const header = req.headers.get('Cookie');

    if (header == null || !header.includes(key)) return null;

    const cookieValue = cookie.parse(header)[key];

    if (cookieValue) return cookieValue;

    return req.headers.get(this.config.cookieKey || '');
  }

  private redirectUrl(state: string) {
    const state2 = encodeURIComponent(state);
    const c = this.config;

    return `${c.domain}/authorize?response_type=code&client_id=${c.authClientId}&redirect_uri=${c.callbackUrl}&scope=openid%20profile%20email&state=${state2}`;
  }

  private async generateStateParamAsync(call: WorkerCall) {
    const resp = await call.fetch(
      new Request('https://csprng.xyz/v1/api', { method: 'get' }),
    );
    const { Data: state } = await resp.json();

    return state;
  }

  private async verifyAsync(req: Request): Promise<AuthorizationModel> {
    const stateCode = this.getStateCode(req);

    if (stateCode == null) return {};

    const state = await this.data.getStateAsync(stateCode);

    if (!state || !state.identity || !state.verified) {
      return {};
    }
    const { access_token: accessToken, id_token: idToken } = state.identity;
    const user = this.toUser(JSON.parse(this.decodeJWT(idToken)));
    const sessionId = state.sessionId;

    if (state.updatedValues) {
      user.fullName = state.updatedValues.fullName;

      if (!user.userInfo) user.userInfo = {};
      user.userInfo.phone = state.updatedValues.phone;
    }
    return { accessToken, idToken, user, sessionId };
  }

  // https://github.com/pose/webcrypto-jwt/blob/master/index.js
  private decodeJWT(token: any) {
    let output = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }

    const result = atob(output);

    try {
      return decodeURIComponent(escape(result));
    } catch (err) {
      console.log(err);
      return result;
    }
  }

  private validateToken(token: any) {
    try {
      const dateInSecs = (d: Date) => Math.ceil(Number(d) / 1000);
      const date = new Date();

      let iss = token.iss;

      // ISS can include a trailing slash but should otherwise be identical to
      // the AUTH0_DOMAIN, so we should remove the trailing slash if it exists
      iss = iss.endsWith('/') ? iss.slice(0, -1) : iss;

      if (iss !== this.config.domain) {
        throw new Error(
          `Token iss value (${iss}) doesn't match AUTH0_DOMAIN (${this.config.domain})`,
        );
      }

      if (token.aud !== this.config.authClientId) {
        throw new Error(
          `Token aud value (${token.aud}) doesn't match AUTH0_CLIENT_ID (${this.config.authClientId})`,
        );
      }

      if (token.exp < dateInSecs(date)) {
        throw new Error(`Token exp value is before current time`);
      }

      // Token should have been issued within the last day
      date.setDate(date.getDate() - 1);
      if (token.iat < dateInSecs(date)) {
        throw new Error(
          `Token was issued before one day ago and is now invalid`,
        );
      }

      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
}
