import { AuthEntrypoint } from './entrypoints';

export type Env = {
  readonly KV_DATA: KVNamespace;

  readonly AUTH_API: AuthEntrypoint;
  readonly ORIGIN: string;

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

  readonly CORS_ORIGINS: string;
  readonly DEBUG: string;
  readonly KV_BYPASS?: string;

  readonly EMAIL_ADMIN: string;
  readonly EMAIL_FROM: string;
};
