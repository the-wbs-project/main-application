import { IdToken } from '../models';
import { DataServiceFactory, Fetcher, JiraService, HttpLogger, OriginService, DataDogService } from '../services';

export type Variables = {
  data: DataServiceFactory;
  datadog: DataDogService;
  jira: JiraService;
  fetcher: Fetcher;
  logger: HttpLogger;
  origin: OriginService;
  idToken: IdToken;
};
