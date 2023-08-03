import { AuthState, Membership } from '../models';
import { DataServiceFactory, Fetcher, Logger } from '../services';

export type Variables = {
  data: DataServiceFactory;
  fetcher: Fetcher;
  logger: Logger;
  state: AuthState;
  membership: Membership;
};
