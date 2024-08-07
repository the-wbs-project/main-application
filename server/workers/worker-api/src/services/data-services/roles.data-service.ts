import { RolesEntrypoint } from '../../config';
import { Role } from '../../models';

export class RolesDataService {
  constructor(private readonly service: RolesEntrypoint) {}

  getAllAsync(): Promise<Role[]> {
    return this.service.getAll();
  }
}
