import { AuthEntrypoint, RolesEntrypoint } from '../../config';
import { Role } from '../../models';

export class RolesDataService {
  constructor(private readonly authApi: AuthEntrypoint) {}

  async getAllAsync(): Promise<Role[]> {
    return (await this.service()).getAll();
  }

  private async service(): Promise<RolesEntrypoint> {
    return this.authApi.roles();
  }
}
