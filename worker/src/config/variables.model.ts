import { UserLite } from '../models';
import { DataServiceFactory, Fetcher, Logger } from '../services';

export type Variables = {
  data: DataServiceFactory;
  fetcher: Fetcher;
  logger: Logger;
  user: UserLite;
};
