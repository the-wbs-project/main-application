import { Organization, Role } from '../../models';
import { Auth0Service } from '../api-services';
import { BaseDataService } from './base.data-service';

export class RoleDataService extends BaseDataService {
  constructor(private readonly api: Auth0Service, kv: KVNamespace, ctx: ExecutionContext) {
    super(kv, ctx);
  }

  public async getAllAsync(): Promise<Role[]> {
    return this.getArrayAsync('ROLES', () => this.api.roles.getAsync());
  }
}
