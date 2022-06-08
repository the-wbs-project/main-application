import * as cookie from 'cookie';
import { AuthConfig } from '../../config';
import { WorkerRequest } from '../worker-request.service';
import { Auth0Service } from './auth0.service';

export class AuthenticationService {
  constructor(private readonly auth0: Auth0Service) {}

  async handleCallbackAsync(req: WorkerRequest): Promise<Headers | null> {
    //
    //  first verify the state
    //
    const url = new URL(req.url);
    const stateCode = url.searchParams.get('state');
    const auth0Code = url.searchParams.get('code');

    if (!auth0Code || !stateCode) return null;

    const state = await req.services.data.auth.getStateAsync(stateCode);
    const token = await this.auth0.getAuthTokenAsync(req);

    if (!token || !state) {
      return null;
    }
    const payload = JSON.parse(this.decodeJWT(token.id_token));
    const validToken = this.validateToken(req.config.auth, payload);

    if (!validToken) {
      console.log('token invalid');
      return null;
    }
    const org = this.getOrganization(req);
    //
    //  Set the email and claims and save.
    //
    state.organization = org;
    state.userId = <string>payload['http://thewbsproject.com/user_id'];
    state.culture = <string>payload['http://thewbsproject.com/culture'];
    state.roles = <string[]>payload['http://thewbsproject.com/roles'];

    req.setOrganization(org);

    await req.services.data.auth.putStateAsync(stateCode, state);

    const secure = req.config.auth.excludeSecureCookie ? '' : ' Secure;';

    return new Headers({
      Location: '/',
      'Set-cookie': `${req.config.auth.cookieKey}=${stateCode};${secure} HttpOnly; SameSite=Lax;`,
    });
  }

  setOrganization(req: WorkerRequest): void {
    const organization = this.getOrganization(req);

    req.setOrganization(organization);
  }

  async authorizeAsync(req: WorkerRequest): Promise<Response | number | void> {
    const stateCode = this.getStateCode(req);

    if (stateCode) {
      const state = await req.services.data.auth.getStateAsync(stateCode);

      if (state) {
        //
        //  Now let's verify the organization is one that should be there.
        //
        const organization = this.getOrganization(req);

        if (state.organization !== organization) return 401;
        //
        //  Looks good, let's go!
        //
        req.setState(state, organization);
        return;
      }
    }
    const state = await this.auth0.generateStateParamAsync(req);
    const url = new URL(req.url);

    await req.services.data.auth.putStateAsync(state, {});

    return Response.redirect(this.auth0.getLoginRedirectUrl(url.origin, state));
  }

  async getLogoutRedirectAsync(req: WorkerRequest): Promise<Response> {
    const url = new URL(req.url);
    const state = this.getStateCode(req);

    if (state) await req.services.data.auth.deleteStateAsync(state);

    return Response.redirect(this.auth0.getLogoutUrl(url.origin));
  }

  async setupAsync(
    req: WorkerRequest,
    inviteCode: string,
  ): Promise<Response | number> {
    const state = await this.auth0.generateStateParamAsync(req);
    const url = new URL(req.url);

    await req.services.data.auth.putStateAsync(state, {});

    return Response.redirect(
      this.auth0.getSetupRedirectUrl(url.origin, state, inviteCode),
    );
  }

  finishLogout(req: WorkerRequest): Response | null {
    const config = req.config.auth;
    const cookieHeader = req.request.headers.get('Cookie');
    if (cookieHeader && cookieHeader.includes(config.cookieKey)) {
      const secure = config.excludeSecureCookie ? '' : ' Secure;';

      return new Response(LOGOUT_HTML, {
        status: 200,
        headers: {
          'Set-cookie': `${config.cookieKey}="";auth0=""; HttpOnly;${secure} SameSite=Lax`,
          'content-type': 'text/html; charset=utf-8',
        },
      });
    }
    return null;
  }

  getStateCode(req: WorkerRequest): string | null {
    const key = req.config.auth.cookieKey || '';

    const header = req.headers.get('Cookie');

    if (header == null || !header.includes(key)) return null;

    const cookieValue = cookie.parse(header)[key];

    if (cookieValue) return cookieValue;

    return req.headers.get(req.config.auth.cookieKey || '');
  }

  private getOrganization(req: WorkerRequest): string {
    return new URL(req.url).host.split('.')[0];
  }

  // https://github.com/pose/webcrypto-jwt/blob/master/index.js
  private decodeJWT(token: string) {
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

  private validateToken(
    config: AuthConfig,
    token: { iss: string; aud: string; exp: number; iat: number },
  ) {
    try {
      const dateInSecs = (d: Date) => Math.ceil(Number(d) / 1000);
      const date = new Date();

      let iss = token.iss;

      // ISS can include a trailing slash but should otherwise be identical to
      // the AUTH0_DOMAIN, so we should remove the trailing slash if it exists
      iss = iss.endsWith('/') ? iss.slice(0, -1) : iss;

      const domain = `https://${config.domain}`;

      if (iss !== domain) {
        throw new Error(
          `Token iss value (${iss}) doesn't match AUTH0_DOMAIN (${domain})`,
        );
      }

      if (token.aud !== config.authClientId) {
        throw new Error(
          `Token aud value (${token.aud}) doesn't match AUTH0_CLIENT_ID (${config.authClientId})`,
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
      console.log((<Error>err).message);
      return false;
    }
  }
}
