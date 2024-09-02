import { IdToken } from '../models';
import { ClaimsService, DataDogService, DataServiceFactory, Fetcher, HttpLogger, JiraService, OriginService } from '../services';

export type Variables = {
  claims: ClaimsService;
  data: DataServiceFactory;
  datadog: DataDogService;
  jira: JiraService;
  fetcher: Fetcher;
  logger: HttpLogger;
  origin: OriginService;
  idToken: IdToken;
};
