import { User, UserLite } from '../../models';
import { Context } from '../../config';

export class Auth0Service {
  static toUser(payload: Record<string, any>): User {
    const user: User = {
      blocked: payload.blocked ?? false,
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

  static toLiteUser(payload: Record<string, any>): UserLite {
    const user: UserLite = {
      email: payload.email,
      name: payload.name,
      id: payload.user_id,
    };
    return user;
  }

  static async makeAuth0CallAsync(ctx: Context, urlSuffix: string, method: string, token: string, body?: unknown): Promise<Response> {
    return await ctx.get('fetcher').fetch(
      new Request(`https://${ctx.env.AUTH_DOMAIN}/api/v2/${urlSuffix}`, {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
  }

  static async getMgmtTokenAsync(ctx: Context): Promise<string> {
    const url = `https://${ctx.env.AUTH_DOMAIN}/oauth/token`;
    const body = {
      client_id: ctx.env.AUTH_CLIENT_ID,
      client_secret: ctx.env.AUTH_CLIENT_SECRET,
      audience: ctx.env.AUTH_AUDIENCE,
      grant_type: 'client_credentials',
    };
    const response = await ctx.get('fetcher').fetch(
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
