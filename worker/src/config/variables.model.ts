import {
  ClaimsService,
  DataDogService,
  DataServiceFactory,
  Fetcher,
  HttpLogger,
  JiraService,
  HttpOriginService,
  AIService,
} from '../services';

export type Variables = {
  ai: AIService;
  claims: ClaimsService;
  data: DataServiceFactory;
  datadog: DataDogService;
  jira: JiraService;
  fetcher: Fetcher;
  logger: HttpLogger;
  origin: HttpOriginService;
  userId: string;
};
