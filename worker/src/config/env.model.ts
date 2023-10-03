export type Env = {
  KV_DATA: KVNamespace;
  BUCKET_SNAPSHOTS: R2Bucket;
  BUCKET_STATICS: R2Bucket;

  AUTH_URL: string;
  AUTH_AUDIENCE: string;
  AUTH_DOMAIN: string;

  DATADOG_API_KEY: string;
  DATADOG_ENV: string;

  MAILGUN_ENDPOINT: string;
  MAILGUN_KEY: string;

  JIRA_API_KEY: string;
  JIRA_DOMAIN: string;
  JIRA_EMAIL: string;

  CORS_ORIGINS: string;
  DEBUG: string;
  KV_BYPASS?: string;
};
