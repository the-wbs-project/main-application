import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class InviteHttpService extends BaseHttpService {
  static async getAsync(req: WorkerRequest): Promise<Response | number> {
    const hdrs = new Headers();

    BaseHttpService.getAuthHeaders(req, hdrs);

    try {
      console.log('getting invite');
      if (!req.params?.organization || !req.params?.code) return 500;

      req.data.setOrganization(req.params.organization);
      //
      //  Get the data from the KV
      //
      const invite = await req.data.invites.getAsync(req.params.code);

      console.log(invite == null);
      if (!invite)
        return new Response(null, {
          headers: hdrs,
          status: 404,
        });

      console.log(invite);

      return await super.buildJson(invite, hdrs);
    } catch (e) {
      req.logException(
        'An error occured trying to get the invite.',
        'InviteHttpService.getAsync',
        <Error>e,
      );
      return new Response(null, {
        headers: hdrs,
        status: 500,
      });
    }
  }
}
