export type Env = {
  KV_AUTH: KVNamespace;
  KV_DATA: KVNamespace;
  BUCKET_SNAPSHOTS: R2Bucket;
  BUCKET_STATICS: R2Bucket;

  AUTH_AUDIENCE: string;
  AUTH_CLIENT_ID: string;
  AUTH_CLIENT_SECRET: string;
  AUTH_CONNECTION: string;
  AUTH_DOMAIN: string;

  API_ENDPOINT: string;

  COSMOS_ENDPOINT: string;
  COSMOS_KEY: string;
  COSMOS_DB: string;

  DATADOG_API_KEY: string;
  DATADOG_ENV: string;

  MAILGUN_ENDPOINT: string;
  MAILGUN_KEY: string;

  CORS_ORIGINS: string;
  DEBUG: string;
  INVITE_TEMPLATE_ID: string;
  KV_BYPASS?: string;

  IMAGES_ACCOUNT: string;
  IMAGES_KEY: string;
};
