import * as cookie from 'cookie';
import { AuthResults } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { Auth0Service } from './auth0.service';

export class AuthenticationService {
  constructor(private readonly auth0: Auth0Service) {}

  async run(req: WorkerRequest): Promise<Response | void> {
    const resp = await req.config.authWorker.fetch(req.request);

    if (resp.status !== 200 || resp.headers.get('pass') === 'true') {
      return resp;
    }
    const text = await resp.text();

    if (!text) return;

    const results: AuthResults = JSON.parse(text);

    if (results.state) {
      req.setState(results.state);

      if (results.roles) {
        req.setOrganization(results.roles);
      }
    }
  }

  async setupAsync(req: WorkerRequest, inviteCode: string): Promise<Response | number> {
    const state = await this.auth0.generateStateParamAsync(req);

    await req.services.data.auth.putStateAsync(state, {});

    return Response.redirect(this.auth0.getSetupRedirectUrl(state, inviteCode));
  }

  getStateCode(req: WorkerRequest): string | null {
    const key = req.config.auth.cookieKey || '';

    const header = req.headers.get('Cookie');

    if (header == null || !header.includes(key)) return null;

    const cookieValue = cookie.parse(header)[key];

    if (cookieValue) return cookieValue;

    return req.headers.get(req.config.auth.cookieKey || '');
  }
}
