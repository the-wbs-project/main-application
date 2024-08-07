import { IdToken } from '../models';
import { DataServiceFactory, Fetcher, HttpLogger, DataDogService } from '../services';

export type Variables = {
  data: DataServiceFactory;
  datadog: DataDogService;
  fetcher: Fetcher;
  logger: HttpLogger;
  idToken: IdToken;
};
