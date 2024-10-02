import {
  ClaimsService,
  DataDogService,
  DataServiceFactory,
  Fetcher,
  HttpLogger,
  JiraService,
  HttpOriginService,
  MailGunService,
} from '../services';

export type Variables = {
  claims: ClaimsService;
  data: DataServiceFactory;
  datadog: DataDogService;
  fetcher: Fetcher;
  jira: JiraService;
  logger: HttpLogger;
  mailgun: MailGunService;
  origin: HttpOriginService;
  userId: string;
};
