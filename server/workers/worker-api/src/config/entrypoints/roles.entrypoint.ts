import { Role } from '../../models';

export interface RolesEntrypoint {
  getAll(): Promise<Role[]>;
}
