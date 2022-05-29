import { parseJwt, JwtParseResult } from '@cfworker/jwt';
import * as cookie from 'cookie';
import { AuthConfig } from '../../config';
import { WorkerRequest } from '../worker-request.service';
import { Auth0Service } from './auth0.service';

export class AuthenticationService {
  constructor(
    private readonly auth0: Auth0Service,
    private readonly config: AuthConfig,
  ) {}

  async handleCallbackAsync(req: WorkerRequest): Promise<Headers | null> {
    //
    //  first verify the state
    //
    const url = new URL(req.url);
    const stateCode = url.searchParams.get('state');
    const auth0Code = url.searchParams.get('code');

    if (!auth0Code || !stateCode) return null;

    const state = await req.data.auth.getStateAsync(stateCode);
    const token = await this.auth0.getAuthTokenAsync(req);

    if (!token || !state) {
      return null;
    }
    const payload = JSON.parse(this.decodeJWT(token.id_token));
    const validToken = this.validateToken(payload);

    if (!validToken) {
      console.log('token invalid');
      return null;
    }
    //
    //  Set the email and claims and save.
    //
    const orgs: string[] = [];

    state.userId = <string>payload['http://thewbsproject.com/user_id'];
    state.culture = <string>payload['http://thewbsproject.com/culture'];
    state.claims = (<string>payload['http://thewbsproject.com/claims']).split(
      ',',
    );

    for (const claim of state.claims) {
      if (claim.endsWith(':user')) {
        const org = claim.split(':')[0];

        if (orgs.indexOf(org) === -1) orgs.push(org);
      }
    }
    state.organizations = orgs;

    await req.data.auth.putStateAsync(stateCode, state);

    const secure = this.config.excludeSecureCookie ? '' : ' Secure;';

    return new Headers({
      Location: '/',
      'Set-cookie': `${this.config.cookieKey}=${stateCode};${secure} HttpOnly; SameSite=Lax;`,
    });
  }

  async fixPostSetupAsync(req: WorkerRequest): Promise<void> {
    const url = new URL(req.url);
    const stateCode = <string>url.searchParams.get('state');

    if (!stateCode) return;

    const state = await req.data.auth.getStateAsync(stateCode);

    if (!state?.userId) return;

    const user = await req.data.identity.getUserAsync(req, state.userId);

    if (!user) return;

    if (user.userInfo == null) user.userInfo = {};
    if (user.appInfo == null) user.appInfo = {};

    const info = <any>user.userInfo;

    if (info.claims) {
      user.appInfo.claims = info.claims;
      user.appInfo.inviteCode = info.inviteCode;

      info.claims = null;
      info.inviteCode = null;
      //
      //  You need to save both app_metadatga and user_metadata
      //
      await req.data.identity.updateUserAsync(req, user);
      await req.data.identity.updateProfileAsync(req, user);
    }
  }

  async authorizeAsync(req: WorkerRequest): Promise<Response | number | void> {
    const stateCode = this.getStateCode(req.request);

    if (stateCode) {
      const state = await req.data.auth.getStateAsync(stateCode);

      if (state) {
        //
        //  Now let's verify the organization is one that should be there.
        //
        const organization = this.getOrganization(req);

        if ((state.organizations?.indexOf(organization) ?? -1) === -1)
          return 401;
        //
        //  Looks good, let's go!
        //
        req.setState(state, organization);
        req.data.setOrganization(organization);
        return;
      }
    }
    const state = await this.auth0.generateStateParamAsync(req);
    const url = new URL(req.url);

    await req.data.auth.putStateAsync(state, {});

    return Response.redirect(this.auth0.getLoginRedirectUrl(url.origin, state));
  }

  async setupAsync(
    req: WorkerRequest,
    inviteCode: string,
  ): Promise<Response | number> {
    const state = await this.auth0.generateStateParamAsync(req);
    const url = new URL(req.url);

    await req.data.auth.putStateAsync(state, {});

    return Response.redirect(
      this.auth0.getSetupRedirectUrl(url.origin, state, inviteCode),
    );
  }

  logout(info: WorkerRequest, siteResponse: Response): Response | null {
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

  private validateToken(token: any) {
    try {
      const dateInSecs = (d: Date) => Math.ceil(Number(d) / 1000);
      const date = new Date();

      let iss = token.iss;

      // ISS can include a trailing slash but should otherwise be identical to
      // the AUTH0_DOMAIN, so we should remove the trailing slash if it exists
      iss = iss.endsWith('/') ? iss.slice(0, -1) : iss;

      const domain = `https://${this.config.domain}`;

      if (iss !== domain) {
        throw new Error(
          `Token iss value (${iss}) doesn't match AUTH0_DOMAIN (${domain})`,
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
      console.log((<Error>err).message);
      return false;
    }
  }
}
