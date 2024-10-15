import { MailMessage, ProjectAssignmentQueueMessage, ProjectCreatedQueueMessage, PublishedEmailQueueMessage } from '../models';

export type Env = {
  readonly KV_DATA: KVNamespace;
  readonly SEND_MAIL_QUEUE: Queue<MailMessage>;
  readonly VERSION_PUBLISHED_QUEUE: Queue<PublishedEmailQueueMessage>;
  readonly PROJECT_CREATED_QUEUE: Queue<ProjectCreatedQueueMessage>;
  readonly PROJECT_ASSIGNMENT_QUEUE: Queue<ProjectAssignmentQueueMessage>;

  readonly ORIGIN: string;

  readonly AI_GATEWAY: string;
  readonly AI_REST_TOKEN: string;
  readonly AI_OPEN_AI_KEY: string;

  readonly AUTH_URL: string;
  readonly AUTH_AUDIENCE: string;
  readonly AUTH_DOMAIN: string;

  readonly DATADOG_API_KEY: string;
  readonly DATADOG_ENV: string;
  readonly DATADOG_HOST: string;

  readonly MAILGUN_ENDPOINT: string;
  readonly MAILGUN_KEY: string;

  readonly JIRA_API_KEY: string;
  readonly JIRA_DOMAIN: string;
  readonly JIRA_EMAIL: string;
  readonly JIRA_SYNC_ENABLED: string;
  readonly JIRA_SYNC_TOKEN: string;
  readonly JIRA_SYNC_QUEUE: Queue;
  readonly JIRA_SYNC_URL: string;

  readonly SITE_URL: string;
  readonly KV_BYPASS?: string;
  readonly WORKER_AUTH_KEY: string;

  readonly EMAIL_ADMIN: string;
  readonly EMAIL_FROM: string;

  readonly EMAIL_SUPRESS: string;

  readonly EMAIL_TEMPLATE_INVITE: string;
  readonly EMAIL_TEMPLATE_PROJECT_ASSIGNED: string;
};
