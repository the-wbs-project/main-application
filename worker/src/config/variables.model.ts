import { AuthState, OrganizationRoles } from '../models';
import { DataServiceFactory, Logger } from '../services';

export type Variables = {
  data: DataServiceFactory;
  fetcher: Fetcher;
  logger: Logger;
  organization: OrganizationRoles;
  state: AuthState;
};
