import { DataServiceFactory, Fetcher, Logger, OriginService } from '../services';

export type Variables = {
  data: DataServiceFactory;
  fetcher: Fetcher;
  logger: Logger;
  origin: OriginService;
  userId: string;
};
