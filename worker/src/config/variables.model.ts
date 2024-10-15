import {
  AIService,
  ClaimsService,
  DataDogService,
  DataServiceFactory,
  Fetcher,
  HttpLogger,
  HttpOriginService,
  JiraService,
  MailBuilderService,
  MailGunService,
} from '../services';

export type Variables = {
  ai: AIService;
  claims: ClaimsService;
  data: DataServiceFactory;
  datadog: DataDogService;
  jira: JiraService;
  fetcher: Fetcher;
  logger: HttpLogger;
  mailBuilder: MailBuilderService;
  mailgun: MailGunService;
  origin: HttpOriginService;
  userId: string;
};
