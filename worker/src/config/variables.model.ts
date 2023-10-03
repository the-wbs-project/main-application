import { IdToken } from '../models';
import { DataServiceFactory, Fetcher, JiraService, Logger, OriginService } from '../services';

export type Variables = {
  data: DataServiceFactory;
  jira: JiraService;
  fetcher: Fetcher;
  logger: Logger;
  origin: OriginService;
  idToken: IdToken;
};
