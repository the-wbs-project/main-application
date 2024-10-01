import { IdToken } from '../models';
import { ClaimsService, DataDogService, DataServiceFactory, Fetcher, HttpLogger, JiraService, HttpOriginService } from '../services';

export type Variables = {
  claims: ClaimsService;
  data: DataServiceFactory;
  datadog: DataDogService;
  jira: JiraService;
  fetcher: Fetcher;
  logger: HttpLogger;
  origin: HttpOriginService;
  idToken: IdToken;
};
