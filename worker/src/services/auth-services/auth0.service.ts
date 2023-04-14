import { parseJwt } from '@cfworker/jwt';
import { AuthConfig } from '../../config';
import { OrganizationRoles, User, UserLite } from '../../models';
import { WorkerRequest } from '../worker-request.service';

export class Auth0Service {
  constructor(private readonly config: AuthConfig) {}

  static async verify(req: WorkerRequest): Promise<Response | number | void> {
    let jwt = req.headers.get('Authorization');
    const issuer = `https://${req.context.config.auth.domain}/`;
    const audience = req.context.config.auth.audience;

    if (!jwt) return 403;

    jwt = jwt.replace('Bearer ', '');

    const result = await parseJwt(jwt, issuer, audience);

    if (!result.valid) {
      console.log(result.reason); // Invalid issuer/audience, expired, etc

      return new Response(result.reason, {
        status: 403,
      });
    }
    //
    //  Get the state.  if it doesn't exist set it up.
    //
    let state = await req.context.services.data.auth.getStateAsync(result.payload.sub, jwt);

    if (!state) {
      const user = await req.context.services.identity.getUserAsync(req, result.payload.sub);

      if (!user)
        return new Response('Cannot find user', {
          status: 500,
        });

      const organizations: OrganizationRoles[] = [];

      for (const organization of Object.keys(user.appInfo.organizations)) {
        organizations.push({ organization, roles: user.appInfo.organizations[organization] });
      }

      state = {
        culture: user.userInfo.culture,
        organizations,
        userId: user.id,
      };

      await req.context.services.data.auth.putStateAsync(result.payload.sub, jwt, state, result.payload.exp);
    }
    req.context.setState(state);
    req.context.setOrganization(state.organizations[0]);
  }

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

  async makeAuth0CallAsync(req: WorkerRequest, urlSuffix: string, method: string, token: string, body?: unknown): Promise<Response> {
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

  async getMgmtTokenAsync(req: WorkerRequest): Promise<string> {
    const url = `https://${this.config.domain}/oauth/token`;
    const body = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
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
}
