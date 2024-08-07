import { Env } from '../config';
import { DataServiceFactory } from './data-services';

export class QueueService {
  constructor(private readonly data: DataServiceFactory, private readonly env: Env) {}

  async refreshAllAsync(): Promise<void> {
    //
    //    Get orgs
    //
    const orgs = await this.data.organizations.getAllAsync();

    for (const org of orgs) {
      const members = await this.data.memberships.getAllAsync(org.id);

      let promises: Promise<any>[] = [];

      for (const member of members) {
        promises.push(this.data.users.getAsync(org.id, member.user_id, 'public'));
        promises.push(this.data.users.getAsync(org.id, member.user_id, 'organization'));

        if (promises.length >= 20) {
          await Promise.all(promises);
          promises = [];
        }
      }

      if (promises.length > 0) await Promise.all(promises);
    }
  }
}
